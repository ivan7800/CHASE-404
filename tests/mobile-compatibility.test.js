import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles/main.css',import.meta.url),'utf8');
const win=readFileSync(new URL('../INICIAR_WINDOWS.bat',import.meta.url),'utf8');
const linux=readFileSync(new URL('../INICIAR_LINUX.sh',import.meta.url),'utf8');
const server=readFileSync(new URL('../local_server.py',import.meta.url),'utf8');
test('mobile: actions for story contacts, evidence and journal have actual handlers',()=>{
 for(const [id,handler] of [['touchInteract','contactInteract'],['touchCollect','collectNearbyDiscovery'],['touchJournal','contactJournal']]){
  assert.match(html,new RegExp(`id="${id}"`));
  assert.ok(main.includes(`$('${id}').addEventListener('click',${handler})`));
 }
});
test('mobile: exploration actions stay hidden outside urban mode',()=>{
 assert.match(html,/class="touch-actions"/);
 assert.ok(main.includes("document.querySelector('.touch-actions').hidden=!urbanMode"));
 assert.match(css,/\.touch-actions\{display:none\}/);
 assert.match(css,/\.touch-actions:not\(\[hidden\]\)/);
});
test('mobile: viewport, press-and-hold pointer controls and responsive rule are present',()=>{
 assert.match(html,/width=device-width,initial-scale=1,viewport-fit=cover/);
 assert.match(main,/setPointerCapture\(e.pointerId\)/);
 assert.match(main,/pointercancel/);
 assert.match(css,/@media\(max-width:740px\)/);
});
test('launchers use relative project root and loopback local server',()=>{
 assert.match(win,/%~dp0/);
 assert.match(win,/local_server\.py/);
 assert.match(linux,/dirname "\$\{BASH_SOURCE\[0\]\}"/);
 assert.match(linux,/python3 \.\/local_server\.py/);
 assert.match(server,/127\.0\.0\.1/);
 assert.match(server,/ThreadingHTTPServer/);
});
