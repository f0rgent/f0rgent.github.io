#!/usr/bin/env python3
"""ps5watch: log what a console asks for when it uses this Mac as DNS + proxy.
No root, no installs. Run: python3 ps5watch.py   (Ctrl+C to stop and print the summary)
On the PS5: Settings > Network > Set Up Internet Connection > your Wi-Fi > Advanced:
  DNS = Manual, Primary = <this Mac's IP>;  Proxy Server = Use, <this Mac's IP>, port 8888.
Only names, times and byte counts are logged. HTTPS content stays encrypted and is never read."""
import asyncio, json, socket, struct, sys, time, collections, os
UPSTREAM = ("1.1.1.1", 53); DNS_PORT = 53; PROXY_PORT = 8888
LOG = os.path.expanduser("~/ps5watch-%s.jsonl" % time.strftime("%m%d-%H%M"))
T0 = time.time(); logf = open(LOG, "a", buffering=1)
dns_hits = collections.Counter(); px = collections.defaultdict(lambda: [0, 0, 0])  # host -> conns, up, down
def log(**k): k["t"] = round(time.time() - T0, 2); logf.write(json.dumps(k) + "\n")
def qname(d):
    i, parts = 12, []
    while i < len(d) and d[i]:
        n = d[i]; parts.append(d[i+1:i+1+n].decode("ascii", "replace")); i += n + 1
    return ".".join(parts).lower()
class DNS(asyncio.DatagramProtocol):
    def connection_made(self, tr): self.tr = tr
    def datagram_received(self, data, addr):
        asyncio.ensure_future(self.handle(data, addr))
    async def handle(self, data, addr):
        try: name = qname(data)
        except Exception: name = "?"
        dns_hits[name] += 1; log(k="dns", src=addr[0], name=name)
        loop = asyncio.get_running_loop()
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.setblocking(False)
        try:
            await loop.sock_sendto(s, data, UPSTREAM)
            resp = await asyncio.wait_for(loop.sock_recv(s, 4096), 4)
            self.tr.sendto(resp, addr)
        except Exception: pass
        finally: s.close()
async def pipe(r, w, host, idx):
    try:
        while True:
            b = await r.read(65536)
            if not b: break
            px[host][idx] += len(b); w.write(b); await w.drain()
    except Exception: pass
    finally:
        try: w.close()
        except Exception: pass
async def proxy(r, w):
    src = w.get_extra_info("peername")[0]
    try:
        head = await asyncio.wait_for(r.readuntil(b"\r\n\r\n"), 15)
    except Exception:
        w.close(); return
    line = head.split(b"\r\n")[0].decode("latin1").split()
    if len(line) < 2: w.close(); return
    method, target = line[0], line[1]
    try:
        if method == "CONNECT":
            host, _, port = target.rpartition(":"); port = int(port or 443); first = b""
        else:
            rest = target.split("://", 1)[-1]; hp, _, path = rest.partition("/")
            host, _, port = hp.partition(":"); port = int(port or 80)
            first = head.replace(target.encode(), ("/" + path).encode(), 1)
        ur, uw = await asyncio.wait_for(asyncio.open_connection(host, port), 10)
    except Exception as e:
        log(k="fail", src=src, host=target, err=str(e)[:60]); w.close(); return
    host = host.lower(); px[host][0] += 1; t = time.time()
    if method == "CONNECT": w.write(b"HTTP/1.1 200 Connection established\r\n\r\n"); await w.drain()
    else: px[host][1] += len(first); uw.write(first); await uw.drain()
    u0, d0 = px[host][1], px[host][2]
    await asyncio.gather(pipe(r, uw, host, 1), pipe(ur, w, host, 2))
    log(k="conn", src=src, host=host, port=port, m=method, up=px[host][1]-u0, down=px[host][2]-d0, secs=round(time.time()-t, 1))
def summary():
    mins = (time.time() - T0) / 60
    print("\n=== %.1f min | %d DNS names (%d lookups) | %d proxied hosts | up %d KB | down %d KB ===" % (
        mins, len(dns_hits), sum(dns_hits.values()), len(px), sum(v[1] for v in px.values()) // 1024, sum(v[2] for v in px.values()) // 1024))
    for h, (c, u, d) in sorted(px.items(), key=lambda x: -x[1][1])[:40]:
        print("%-52s conns %4d  up %8.1f KB  down %9.1f KB" % (h[:52], c, u / 1024, d / 1024))
    print("log:", LOG)
async def main():
    loop = asyncio.get_running_loop()
    try: await loop.create_datagram_endpoint(DNS, local_addr=("0.0.0.0", DNS_PORT))
    except PermissionError: print("Cannot bind port 53 without sudo. Run: sudo python3 ps5watch.py"); return
    srv = await asyncio.start_server(proxy, "0.0.0.0", PROXY_PORT)
    ip = "?"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(("1.1.1.1", 80)); ip = s.getsockname()[0]; s.close()
    except Exception: pass
    print("ps5watch running. Mac IP: %s | DNS port %d | proxy port %d | log %s" % (ip, DNS_PORT, PROXY_PORT, LOG)); sys.stdout.flush()
    async with srv:
        while True:
            await asyncio.sleep(60); print("%.0f min: %d lookups, %d proxied conns" % ((time.time()-T0)/60, sum(dns_hits.values()), sum(v[0] for v in px.values()))); sys.stdout.flush()
if __name__ == "__main__":
    try: asyncio.run(main())
    except KeyboardInterrupt: pass
    finally: summary()
