"""Optional real-browser smoke: no test claims if localhost/WebGL is blocked."""
import json, time, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
output=root/'QA_BROWSER_RESULT.json'
state={'status':'NOT_RUN','errors':[],'checks':{},'webgl':False}
server=subprocess.Popen(['python3','-m','http.server','8774','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.STDOUT)
try:
    time.sleep(.8)
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox'])
        page=browser.new_page(viewport={'width':1360,'height':850})
        page.on('pageerror',lambda e:state['errors'].append(str(e)))
        page.goto('http://127.0.0.1:8774/',wait_until='domcontentloaded',timeout=12000)
        page.wait_for_timeout(1300)
        state['webgl']=page.evaluate("Boolean(document.createElement('canvas').getContext('webgl'))")
        state['checks']['page_title']=page.title()
        state['checks']['error_overlay']=page.locator('#errorOverlay').is_visible()
        state['checks']['model_status']=page.locator('#modelIndicator').inner_text()
        if state['webgl'] and not state['checks']['error_overlay']:
            page.locator('#startBtn').click()
            page.keyboard.down('w');page.wait_for_timeout(1500);page.keyboard.up('w')
            state['checks']['speed']=page.locator('#speed').inner_text()
            page.locator('#graphicsBtn').click()
            state['checks']['graphics_label']=page.locator('#graphicsBtn').inner_text()
            page.locator('#cameraBtn').click()
            page.locator('#pauseBtn').click()
            state['checks']['paused']=page.locator('#overlay').is_visible()
            page.screenshot(path=str(root/'QA_PREVIEW.png'))
            state['status']='PASS' if int(state['checks']['speed'])>1 and state['checks']['paused'] and not state['errors'] else 'FAIL'
        else:state['status']='BLOCKED_WEBGL'
        browser.close()
except Exception as e:
    state['status']='BLOCKED_BROWSER';state['errors'].append(str(e)[:2500])
finally:
    server.terminate();server.wait(timeout=10)
    output.write_text(json.dumps(state,indent=2,ensure_ascii=False))
    print(output.read_text())
