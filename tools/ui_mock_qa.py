"""Test actual UI controller in Chromium when the environment forbids graphics/HTTP.
The renderer ONLY is stubbed. This does NOT validate WebGL or GLB on a GPU.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
html=re.sub(r'<script type="module".*?</script>','',html)
html=html.replace('<link rel="stylesheet" href="./styles/main.css">','<style>'+(root/'styles/main.css').read_text()+'</style>')
scripts=[]
for name in ['track','garage','physics','geometry','audio','race','progression','main']:
    js=(root/'src'/f'{name}.js').read_text()
    js=re.sub(r'^import .*?;\s*$', '',js,flags=re.M)
    js=re.sub(r'\bexport (?=(?:const|let|function|class)\b)','',js)
    scripts.append(js)
mock="""
class Renderer{
 constructor(canvas){this.canvas=canvas;this.fps=60;this.cameraMode=0;this.startCam=true;this.modelSource='GLB';this.modelError=null;this.quality=1;this.effects={clear(){}};this.effectsEnabled=true;}
 render(car,dt){}
 nextCamera(){this.cameraMode=(this.cameraMode+1)%3;return ['CHASE','WIDE','BONNET'][this.cameraMode];}
 setQuality(value){this.quality=value;}
 setEffectsEnabled(value){this.effectsEnabled=value;}
 emitDrivingEffects(car,dt,handbrake){}
 changeTrack(){this.changedTrack=true;}
 changeVehicle(id){this.carId=id;this.modelSource=id==='racer'?'GLB':'procedural';}
}
"""
with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900})
    page.set_default_timeout(3000)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(html,wait_until='load')
    page.add_script_tag(content="window.__testStore=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return window.__testStore.get(k)??null},setItem(k,v){window.__testStore.set(k,String(v))}}});")
    page.add_script_tag(content='\n'.join(scripts[:7])+mock+scripts[7])
    def vis(sel):return page.locator(sel).is_visible()
    page.screenshot(path='/mnt/data/daytona_f6/f5_intro.png')
    checks={'initial_overlay':vis('#overlay')}
    # Initial selection and physical tuning are checked before the race starts.
    checks['default_track']=page.locator('#trackSelect').input_value()=='sunset'
    checks['default_car']=page.locator('#carSelect').input_value()=='racer'
    page.locator('#trackSelect').select_option('pacific')
    checks['switch_pacific']=page.evaluate("getTrack().id==='pacific'&&renderer.changedTrack&&race.rivals.length===7")
    checks['track_label']=page.locator('#headerTrack').inner_text()=='PACIFIC COAST'
    checks['pacific_length']=page.evaluate('LENGTH>1050')
    page.locator('#carSelect').select_option('falcon')
    checks['switch_car']=page.evaluate("renderer.carId==='falcon'&&car.tune.power===getCar('falcon').tune.power")
    checks['car_status_label']=page.locator('#carDescription').inner_text()=='Aceleración explosiva'
    checks['garage_stats']=page.locator('#carStats meter').count()==4
    checks['car_identity']=page.locator('#carType').inner_text()=='SPRINTER'
    page.locator('#trackSelect').select_option('ridge')
    checks['switch_ridge']=page.evaluate("getTrack().id==='ridge'&&car.completed===0")
    page.locator('#trackSelect').select_option('sunset')
    page.locator('#carSelect').select_option('racer')
    checks['switch_back']=page.evaluate("getTrack().id==='sunset'&&renderer.carId==='racer'")
    page.locator('#helpBtn').click();checks['help_open']=vis('#helpOverlay')
    page.locator('#closeHelpBottom').click();checks['help_close']=not vis('#helpOverlay')
    page.locator('#startBtn').click();checks['start']=not vis('#overlay')
    checks['fx_default_active']=page.locator('#fxBtn').get_attribute('aria-pressed')=='true'
    page.locator('#fxBtn').click()
    checks['fx_button_off']=page.evaluate('renderer.effectsEnabled===false')
    page.keyboard.press('f')
    checks['fx_keyboard_on']=page.evaluate('renderer.effectsEnabled===true')
    checks['fx_persisted']=page.evaluate("localStorage.getItem('chase404.effects.v6')==='on'")
    checks['fx_overlay_present']=page.locator('#speedFx').count()==1 and page.locator('#impactFx').count()==1
    page.keyboard.down('w');page.wait_for_timeout(1300);page.keyboard.up('w')
    checks['accelerate']=int(page.locator('#speed').inner_text())>5
    page.keyboard.down('a');page.wait_for_timeout(350);page.keyboard.up('a')
    checks['steering']=bool(page.evaluate('car.yaw!==0'))
    page.locator('#graphicsBtn').click();checks['quality_button']=bool(page.evaluate('renderer.quality===.78'))
    page.keyboard.press('g');checks['quality_keyboard']=bool(page.evaluate('renderer.quality===.55'))
    page.locator('#cameraBtn').click();checks['camera']=bool(page.evaluate('renderer.cameraMode===1'))
    page.locator('#pauseBtn').click();checks['pause']=vis('#overlay')
    page.locator('#carSelect').select_option('nova');checks['paused_car_change_resets']=page.evaluate("car.tune.grip===getCar('nova').tune.grip&&!started&&paused")
    page.locator('#startBtn').click();checks['resume']=not vis('#overlay')
    page.locator('#resetBtn').click();page.wait_for_timeout(200);checks['reset']=int(page.locator('#speed').inner_text())==0
    checks['rivals_visible_in_data']=int(page.evaluate('race.rivals.length'))==7
    checks['leaderboard_populated']=page.locator('#leaderboard .leader-row').count()==8
    checks['ranking_live']=bool(page.locator('#racePosition').inner_text())
    checks['three_laps']=page.locator('#raceLaps').inner_text()=='03'
    page.keyboard.press('p');checks['keyboard_pause']=vis('#overlay')
    page.keyboard.press('p');checks['keyboard_resume']=not vis('#overlay')
    page.keyboard.press('h');checks['keyboard_help']=vis('#helpOverlay')
    page.keyboard.press('h');checks['keyboard_help_close']=not vis('#helpOverlay')
    page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(150)
    checks['touch_visible']=vis('#touchGas') and vis('#touchLeft')
    bounds=page.locator('#touchGas').bounding_box()
    page.mouse.move(bounds['x']+bounds['width']/2,bounds['y']+bounds['height']/2)
    page.mouse.down()
    checks['touch_input_on']=bool(page.evaluate('inputs.throttle'))
    page.mouse.up()
    checks['touch_input_off']=not bool(page.evaluate('inputs.throttle'))
    # Force final race state through the same finish handler; graphic engine remains stubbed.
    page.evaluate('car.completed=3;stepRace(race,car,FIXED_STEP);finishRace()')
    checks['finish_panel']=vis('#finishOverlay')
    checks['finish_results']=page.locator('#finishBoard .finish-row').count()==8
    checks['finish_circuit_car']=bool(page.locator('#finishSelection').inner_text())
    page.locator('#backToGarageBtn').click()
    checks['garage_after_finish']=vis('#overlay') and not vis('#finishOverlay')
    page.locator('#startBtn').click()
    page.evaluate('car.completed=3;stepRace(race,car,FIXED_STEP);finishRace()')
    page.locator('#restartRaceBtn').click()
    checks['new_race_after_finish']=not vis('#finishOverlay') and not vis('#overlay') and int(page.evaluate('car.completed'))==0
    # Fase 5: four playable modes, cup flow, persisted rewards and visual themes.
    page.keyboard.press('p')
    page.locator('#modeSelect').select_option('time')
    checks['time_no_ai']=page.evaluate("mode==='time'&&race.rivals.length===0&&race.laps===3")
    checks['time_label']=page.locator('#modeHUD').inner_text().startswith('TIME ATTACK')
    page.locator('#startBtn').click()
    page.evaluate('car.completed=3;stepRace(race,car,FIXED_STEP);finishRace()')
    checks['time_results_solo']=page.locator('#finishBoard .finish-row').count()==1
    checks['time_total_record']=page.evaluate("profile.bestTotals['time.sunset.nova']>0")
    page.locator('#backToGarageBtn').click()
    page.locator('#modeSelect').select_option('free')
    checks['free_no_ai_unlimited']=page.evaluate("mode==='free'&&race.rivals.length===0&&race.laps===Infinity")
    page.locator('#startBtn').click()
    page.evaluate('car.completed=30;stepRace(race,car,FIXED_STEP)')
    checks['free_never_finishes']=page.evaluate('!race.finished&&race.elapsed>0')
    page.keyboard.press('p')
    page.locator('#modeSelect').select_option('championship')
    checks['cup_starts_on_sunset']=page.evaluate("mode==='championship'&&getTrack().id==='sunset'&&profile.cup.results.length===0")
    checks['cup_locks_garage']=page.locator('#trackSelect').is_disabled() and page.locator('#carSelect').is_disabled()
    page.locator('#startBtn').click()
    page.evaluate('car.completed=3;stepRace(race,car,FIXED_STEP);finishRace()')
    checks['cup_round_1_awarded']=page.evaluate("profile.cup.results.length===1&&profile.cup.results[0].track==='sunset'")
    page.evaluate('finishRace()')
    checks['cup_reject_duplicate_finish']=page.evaluate('profile.cup.results.length===1')
    checks['cup_next_button']=vis('#nextCupBtn')
    page.locator('#nextCupBtn').click()
    checks['cup_round_2_pacific']=page.evaluate("getTrack().id==='pacific'&&race.elapsed===0&&!paused")
    page.evaluate('car.completed=3;stepRace(race,car,FIXED_STEP);finishRace()')
    page.locator('#nextCupBtn').click()
    checks['cup_round_3_ridge']=page.evaluate("getTrack().id==='ridge'&&profile.cup.results.length===2")
    page.evaluate('car.completed=3;stepRace(race,car,FIXED_STEP);finishRace()')
    checks['cup_completed']=page.evaluate('profile.cup===null&&profile.cups>=1')
    page.screenshot(path='/mnt/data/daytona_f6/f5_cup.png')
    checks['cup_summary']=vis('#finishOverlay') and 'COPA' in page.locator('#finishTitle').inner_text()
    checks['gold_unlocked']=not page.locator('#themeSelect option[value="gold"]').is_disabled()
    page.locator('#backToGarageBtn').click()
    page.locator('#themeSelect').select_option('gold')
    checks['gold_visual_theme']=page.locator('#app').get_attribute('data-theme')=='gold'
    checks['saved_profile']=page.evaluate("JSON.parse(localStorage.getItem(PROFILE_KEY)).cups>=1")
    page.locator('#startBtn').click()
    checks['new_cup_restarts']=page.evaluate("profile.cup.results.length===0&&getTrack().id==='sunset'&&!paused")
    browser.close()
    report={'status':'PASS' if all(checks.values()) and not errors else 'FAIL','renderer':'STUBBED — NO WEBGL VALIDATION', 'checks':checks,'errors':errors}
    (root/'QA_UI_RESULT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps(report,ensure_ascii=False,indent=2))
