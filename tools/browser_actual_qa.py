"""Real HTTP browser smoke with intercepted static resources (no external requests).
Runs the actual JavaScript modules + WebGL when the runner supports it.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1]
checks={}
errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=browser.new_page(viewport={'width':1366,'height':900}, device_scale_factor=1)
 page.on('pageerror',lambda e: errors.append(str(e)))
 def route_request(route):
  url=route.request.url
  if not url.startswith('http://daytona.test/'):return route.abort()
  rel=url.split('http://daytona.test/',1)[1].split('?',1)[0]
  path=(root/rel).resolve() if rel else root/'index.html'
  if not path.is_relative_to(root) or not path.is_file():return route.fulfill(status=404,body='Not found')
  suffix=path.suffix.lower()
  ctype={'.html':'text/html','.css':'text/css','.js':'text/javascript','.glb':'model/gltf-binary','.svg':'image/svg+xml','.json':'application/json'}.get(suffix,'application/octet-stream')
  return route.fulfill(status=200,body=path.read_bytes(),headers={'content-type':ctype})
 page.route('**/*',route_request)
 try:
  response=page.goto('http://daytona.test/index.html',wait_until='load',timeout=14000)
  page.wait_for_timeout(750)
  checks['navigation']=response.status==200
  checks['game_boot']=page.locator('#errorOverlay').is_hidden() and page.locator('#overlay').is_visible()
  checks['webgl_available']=page.evaluate("!!document.getElementById('scene').getContext('webgl')")
  checks['quality_auto']=page.locator('#graphicsBtn').inner_text().find('AUTO')>=0
  page.locator('#settingsBtn').click(); checks['settings_open']=page.locator('#settingsOverlay').is_visible()
  page.locator('#settingScale').select_option('120')
  page.locator('#settingContrast').check();page.locator('#settingMotion').check()
  page.locator('#bind-throttle').select_option('KeyI')
  page.locator('#bind-brake').select_option('KeyK')
  page.locator('#bind-left').select_option('KeyJ')
  page.locator('#bind-right').select_option('KeyL')
  page.locator('#bind-handbrake').select_option('ShiftLeft')
  page.locator('#saveSettings').click()
  checks['settings_saved']=page.evaluate("localStorage.getItem('chase404.settings.v7')?.includes('KeyI')===true")
  checks['contrast_applied']=page.locator('#app').get_attribute('data-contrast')=='true'
  checks['reduced_motion_applied']=page.locator('#app').get_attribute('data-reduced-motion')=='true'
  checks['hud_scale_applied']=page.locator('#app').get_attribute('data-hud-scale')=='120'
  checks['settings_closed']=page.locator('#settingsOverlay').is_hidden()
  page.locator('#settingsBtn').click()
  page.locator('#bind-throttle').select_option('KeyL')
  page.locator('#saveSettings').click()
  checks['duplicate_rejected']=page.locator('#settingsOverlay').is_visible() and 'distinta' in page.locator('#settingsError').inner_text()
  page.locator('#resetSettings').click();checks['settings_reset_form']=page.locator('#bind-throttle').input_value()=='KeyW'
  page.locator('#saveSettings').click()
  page.locator('#startBtn').click();page.wait_for_timeout(200)
  checks['race_started']=page.locator('#overlay').is_hidden()
  page.locator('#settingsBtn').click();checks['settings_during_race']=page.locator('#settingsOverlay').is_visible()
  page.keyboard.press('Escape');checks['escape_settings']=page.locator('#settingsOverlay').is_hidden()
  page.locator('#pauseBtn').click();checks['pause_still_operates']=page.locator('#overlay').is_visible()
  checks['model_label']=page.locator('#modelIndicator').inner_text().strip()!=''
  checks['no_js_errors']=not errors
  try:page.screenshot(path='/mnt/data/DAYTONA-404_FASE-7_BROWSER.png',full_page=True,timeout=6000)
  except Exception: pass
 except Exception as e:errors.append('Browser flow: '+repr(e))
 finally:browser.close()
result={'checks':checks,'errors':errors,'passed':sum(checks.values()),'total':len(checks)}
(root/'QA_BROWSER_F7.json').write_text(json.dumps(result,indent=2,ensure_ascii=False))
print(json.dumps(result,indent=2,ensure_ascii=False))
