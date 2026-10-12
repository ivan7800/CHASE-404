from pathlib import Path
from playwright.sync_api import sync_playwright
import json,subprocess,time
root=Path(__file__).resolve().parents[1]
checks={};errors=[]
server=subprocess.Popen(['python3','-m','http.server','18743','--bind','127.0.0.1','--directory',str(root)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(.5)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=browser.new_page(viewport={'width':1366,'height':900})
 page.on('pageerror',lambda e:errors.append(str(e)))
 def route(req):
  path=(root/req.request.url.split('http://chase.test/',1)[-1].split('?',1)[0]).resolve()
  if not path.is_relative_to(root) or not path.is_file():return req.fulfill(status=404,body='Not found')
  ty={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.glb':'model/gltf-binary'}.get(path.suffix,'application/octet-stream')
  return req.fulfill(body=path.read_bytes(),content_type=ty)
 # Using a real local HTTP server avoids blocked test hostnames.
 try:
  page.goto('http://127.0.0.1:18743/index.html',wait_until='load');page.wait_for_timeout(1200)
  checks['no_crash_at_boot']=page.locator('#errorOverlay').is_hidden()
  checks['urban_mode_default']=page.locator('#trackSelect').input_value()=='barcelona'
  checks['protagonist_named']=page.locator('#overlay').inner_text().find('Gael Verenne')>=0
  page.locator('#startBtn').click();page.wait_for_timeout(350)
  checks['mission_started']=page.locator('#overlay').is_hidden()
  checks['mission_visible']=page.locator('#missionHUD').is_visible()
  checks['first_objective']=page.locator('#missionObjective').inner_text().find('taller')>=0
  page.keyboard.down('w');page.wait_for_timeout(300);page.keyboard.up('w')
  checks['speed_changes']=int(page.locator('#speed').inner_text())>0
  page.keyboard.press('p');page.wait_for_timeout(120)
  checks['pause']=page.locator('#overlay').is_visible()
  page.locator('#startBtn').click();page.keyboard.press('r');page.wait_for_timeout(160)
  checks['restart_resets_time']=page.locator('#lapClock').inner_text().startswith('02:34') or page.locator('#lapClock').inner_text().startswith('02:35')
  checks['no_js_errors']=not errors
 except Exception as e:errors.append(repr(e))
 finally:browser.close();server.terminate()
report={'checks':checks,'errors':errors,'passed':sum(checks.values()),'total':len(checks)}
(root/'QA_BROWSER_FASE_1.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
print(json.dumps(report,indent=2,ensure_ascii=False))
