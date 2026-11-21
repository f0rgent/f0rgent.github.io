#!/usr/bin/env python3
"""ps5web: full-screen browser view (green code rain + REAL feed) of the newest ~/ps5watch-*.jsonl.
Run: python3 ps5web.py   then it opens http://127.0.0.1:8899  (local only, read-only). Ctrl+C to stop."""
import glob, json, os, sys, webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
PAGE = r"""<!doctype html><meta charset=utf-8><title>ps5watch</title>
<style>:root{--b:#b3200f;--h:#ff8a3c;--l:#ff5a2a;--g:#ff3b12;--d:#8a2a16;--s:#ffd24a}:root.green{--b:#1f8f3a;--h:#7dff9a;--l:#5dff86;--g:#2bff6a;--d:#2c7a41;--s:#ffd24a}html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:Menlo,Monaco,monospace}
canvas{position:fixed;inset:0}#hud{position:fixed;left:4.5%;top:6%;border:1px solid var(--b);background:#000c;color:var(--h);font-size:clamp(16px,1.7vw,26px);padding:10px 18px;text-shadow:0 0 8px var(--g)}
#log{position:fixed;left:4.5%;right:4.5%;bottom:5%;height:46%;border:1px solid var(--b);background:#000;color:var(--l);font-size:clamp(13px,1.25vw,20px);line-height:1.55;padding:10px 22px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;text-shadow:0 0 6px var(--g)}
#log div{white-space:nowrap}.t{color:var(--d)}.s{color:#ffb02e;text-shadow:0 0 6px #ff7a00}.n{color:#4dff7c;text-shadow:0 0 6px #19c94d}.w{color:#f4f4f4;text-shadow:0 0 5px #fff6}.r{color:#ff3a2a;text-shadow:0 0 7px #ff1a0a}#cur{display:inline-block;width:.6em;height:1em;background:var(--l);vertical-align:-2px;animation:b 1s steps(1) infinite}@keyframes b{50%{opacity:0}}</style>
<canvas id=c></canvas><div id=hud>ps5watch :: waiting for the console</div><div id=log></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');let cols=[],fs=22;
function rs(){c.width=innerWidth;c.height=innerHeight;cols=Array(Math.ceil(c.width/fs)).fill(0).map(()=>Math.random()*-60)}rs();onresize=rs;
const ch='アイウエオカキクケコサシスセソ0123456789ABCDEF{}[]<>#$%&';
setInterval(()=>{x.fillStyle='rgba(0,0,0,.07)';x.fillRect(0,0,c.width,c.height);x.font=fs+'px Menlo';
cols.forEach((y,i)=>{const g=document.documentElement.classList.contains('green'),r=Math.random();x.fillStyle=g?(r<.04?'#d8ffe0':'#22c14e'):(r<.04?'#fff1c2':r<.3?'#ff8a1f':'#e0260f');x.fillText(ch[Math.random()*ch.length|0],i*fs,y*fs);cols[i]=y*fs>c.height&&Math.random()>.975?0:y+1})},55);
const log=document.getElementById('log'),hud=document.getElementById('hud');let pos=0,look=0,up=0,down=0,t=0;
const kb=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':(n/1024).toFixed(1)+' KB',esc=s=>String(s).replace(/[<&>]/g,'');
async function poll(){try{const r=await (await fetch('/events?pos='+pos)).json();pos=r.pos;
for(const e of r.events){t=e.t||t;const d=document.createElement('div');const ts='<span class=t>['+String((t).toFixed(2)).padStart(8)+']</span> ';
const hot=/telemetry|metric|analytic|track|collect|stats|event|beacon/i;if(e.k=='dns'){look++;d.innerHTML=ts+'<span class='+(hot.test(e.name)?'r':'n')+'>DNS  </span><span class='+(hot.test(e.name)?'r':'w')+'>'+esc(e.name)+'</span>'}
else if(e.k=='conn'){up+=e.up||0;down+=e.down||0;d.innerHTML=ts+'<span class='+(hot.test(e.host)?'r':'s')+'>SEND </span><span class='+(hot.test(e.host)?'r':'w')+'>'+esc(e.host)+(e.port?':'+e.port:'')+'</span><span class=s>  up '+kb(e.up||0)+'  down '+kb(e.down||0)+'</span>'}
else continue;log.appendChild(d);while(log.children.length>40)log.firstChild.remove()}
if(pos)hud.textContent='ps5watch :: '+look+' lookups · sent '+kb(up)+' · received '+kb(down)+' · '+String(t/60|0).padStart(2,'0')+':'+String(t%60|0).padStart(2,'0')}catch(e){}
setTimeout(poll,400)}poll();
onkeydown=e=>{if(e.key=='g')document.documentElement.classList.toggle('green')};ondblclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
</script>"""
def newest():
    f = sorted(glob.glob(os.path.expanduser("~/ps5watch-*.jsonl")), key=os.path.getmtime)
    return f[-1] if f else None
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        if self.path.startswith("/events"):
            try: pos = int(self.path.split("pos=")[1])
            except Exception: pos = 0
            ev = []; p = LOGPATH or newest()
            if p and os.path.exists(p):
                with open(p, "rb") as f:
                    f.seek(pos); data = f.read(200000); cut = data.rfind(b"\n") + 1; pos += cut
                    for l in data[:cut].splitlines():
                        try: ev.append(json.loads(l))
                        except Exception: pass
            body = json.dumps({"pos": pos, "events": ev}).encode(); ct = "application/json"
        else: body = PAGE.encode(); ct = "text/html; charset=utf-8"
        self.send_response(200); self.send_header("Content-Type", ct); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)
LOGPATH = sys.argv[1] if len(sys.argv) > 1 else None
if __name__ == "__main__":
    s = ThreadingHTTPServer(("127.0.0.1", 8899), H); print("ps5web on http://127.0.0.1:8899  (double-click the page for full screen)")
    try: webbrowser.open("http://127.0.0.1:8899")
    except Exception: pass
    try: s.serve_forever()
    except KeyboardInterrupt: pass
