#!/usr/bin/env python3
"""ps5view: live full-screen view of the newest ~/ps5watch-*.jsonl log. Read-only, no network.
Run in a second Terminal window: python3 ps5view.py   (q to quit). Make the window big, dark theme."""
import curses, glob, json, os, time, collections, sys
def newest():
    f = sorted(glob.glob(os.path.expanduser("~/ps5watch-*.jsonl")), key=os.path.getmtime)
    return f[-1] if f else None
def dom(n):
    p = n.split("."); return ".".join(p[-2:]) if len(p) > 1 and not p[-1].isdigit() else n
def kb(n): return "%.1f MB" % (n / 1048576) if n >= 1048576 else "%.1f KB" % (n / 1024)
def main(scr):
    curses.curs_set(0); scr.nodelay(True); curses.start_color(); curses.use_default_colors()
    red = 196 if curses.COLORS >= 256 else curses.COLOR_RED; dim = 240 if curses.COLORS >= 256 else curses.COLOR_WHITE
    curses.init_pair(1, red, -1); curses.init_pair(2, dim, -1); curses.init_pair(3, curses.COLOR_WHITE, -1); curses.init_pair(4, 0, red)
    R, D, W, INV = curses.color_pair(1) | curses.A_BOLD, curses.color_pair(2), curses.color_pair(3) | curses.A_BOLD, curses.color_pair(4) | curses.A_BOLD
    path = sys.argv[1] if len(sys.argv) > 1 else None; fh = None; pos = 0
    feed = collections.deque(maxlen=400); look = collections.Counter(); up = collections.Counter(); down = collections.Counter(); conns = collections.Counter()
    names = set(); t_last = 0.0; tick = 0
    def put(y, x, s, a=0):
        h, w = scr.getmaxyx()
        if 0 <= y < h and 0 <= x < w - 1:
            try: scr.addstr(y, x, s[:w - 1 - x], a)
            except curses.error: pass
    while True:
        if scr.getch() in (ord("q"), 27): break
        if fh is None:
            path = path or newest()
            if path and os.path.exists(path): fh = open(path)
        if fh:
            for line in fh.readlines():
                try: e = json.loads(line)
                except Exception: continue
                t_last = e.get("t", t_last); ts = "%02d:%05.2f" % (int(t_last // 60), t_last % 60)
                if e.get("k") == "dns":
                    n = e.get("name", "?"); look[dom(n)] += 1; names.add(n); feed.append((ts, "DNS ", n, ""))
                elif e.get("k") == "conn":
                    h = e.get("host", "?"); d = dom(h); up[d] += e.get("up", 0); down[d] += e.get("down", 0); conns[d] += 1
                    feed.append((ts, "SEND", h, "up %s  down %s  %ss" % (kb(e.get("up", 0)), kb(e.get("down", 0)), e.get("secs", 0))))
        scr.erase(); h, w = scr.getmaxyx(); split = max(40, int(w * 0.58))
        put(0, 0, " PS5 WATCH ", INV); put(0, 12, " every request the console makes, live", D)
        put(0, max(12, w - 12), "● REC" if tick % 10 < 6 else "  REC", R)
        stats = [("TIME", "%02d:%02d" % (int(t_last // 60), int(t_last % 60))), ("LOOKUPS", str(sum(look.values()))), ("HOSTS", str(len(names))),
                 ("CONNECTIONS", str(sum(conns.values()))), ("SENT", kb(sum(up.values()))), ("RECEIVED", kb(sum(down.values())))]
        x = 1
        for k, v in stats:
            put(2, x, k, D); put(3, x, v, W if k != "SENT" else R); x += max(len(k), len(v)) + 4
        put(5, 0, "─" * (w - 1), D); put(6, 1, "LIVE FEED", R); put(6, split + 1, "TOP HOSTS BY DATA SENT", R)
        rows = h - 8; items = list(feed)[-rows:]
        for i, (ts, kind, name, extra) in enumerate(items):
            y = 7 + i; fresh = i >= len(items) - 2
            put(y, 1, ts, D); put(y, 10, kind, R if kind == "SEND" else D); put(y, 15, name[:split - 17], W if fresh else 0)
            if extra and len(name) + 17 < split - len(extra) - 2: put(y, split - len(extra) - 2, extra, D)
        for y in range(6, h - 1): put(y, split - 1, "│", D)
        top = sorted(set(up) | set(look), key=lambda d: (-up[d], -look[d]))[:rows]; mx = max([up[d] for d in top] + [1]); bw = max(6, w - split - 44)
        for i, d in enumerate(top):
            y = 7 + i; n = int(bw * up[d] / mx)
            put(y, split + 1, d[:26].ljust(26), W if i < 3 else 0); put(y, split + 28, "█" * n, R); put(y, split + 28 + n, "░" * (bw - n), D)
            put(y, split + 29 + bw, ("%s  %dx" % (kb(up[d]), look[d] + conns[d])).rjust(14), D)
        if not fh: put(h // 2, 2, "waiting for ~/ps5watch-*.jsonl ... start ps5watch.py first", R)
        put(h - 1, 0, " names, times and byte counts only. content stays encrypted.  q = quit ", D)
        scr.refresh(); tick += 1; time.sleep(0.1)
if __name__ == "__main__": curses.wrapper(main)
