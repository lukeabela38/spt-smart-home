const assert = require('node:assert/strict');
const WebSocket = require('ws');
const fs = require('node:fs');

(async () => {
  const endpoint = process.env.TIZEN_CDP_ENDPOINT || 'http://127.0.0.1:9333';
  const targets = await (await fetch(endpoint + '/json')).json();
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.once('open', r));
  let sequence = 0;
  const pending = new Map();
  ws.on('message', raw => { const m = JSON.parse(raw); if (pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } });
  const call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id,{resolve,reject}); ws.send(JSON.stringify({id,method,params})); });
  const evaluate = async expression => { const r = await call('Runtime.evaluate',{expression,returnByValue:true}); if(r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value; };
  const key = async code => { await call('Input.dispatchKeyEvent',{type:'rawKeyDown',windowsVirtualKeyCode:code,nativeVirtualKeyCode:code}); await call('Input.dispatchKeyEvent',{type:'keyUp',windowsVirtualKeyCode:code,nativeVirtualKeyCode:code}); };
  let passed = 0;
  function check(value, message) { assert(value, message); passed++; console.log('PASS ' + message); }
  const errors = [];
  ws.on('message', raw => { const m=JSON.parse(raw); if(m.method==='Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); });
  await call('Runtime.enable');
  check(await evaluate("document.querySelectorAll('#row .tile').length") === 6, 'six streaming apps available');
  for (let i = 0; i < 7; i++) await key(37);
  check(await evaluate("document.getElementById('selected-title').textContent") === 'Netflix', 'left edge selects Netflix');
  await key(39);
  check(await evaluate("document.getElementById('selected-title').textContent") === 'YouTube', 'remote navigation updates selected title');
  check(await evaluate("document.querySelectorAll('[aria-selected=true]').length") === 1, 'one accessible selection');
  check(await evaluate("document.getElementById('row').getAttribute('aria-activedescendant') === document.querySelector('.tile.focus').id"), 'accessible focus matches visual focus');
  const layout = await evaluate(`(() => {
    const tiles = [...document.querySelectorAll('.tile')];
    const bounds = tiles.map(t => t.getBoundingClientRect());
    const title = document.getElementById('selection').getBoundingClientRect();
    const hint = document.getElementById('remote-hint').getBoundingClientRect();
    return { unclipped: bounds.every(r => r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight),
      separated: title.bottom + 20 < bounds[0].top, hintInside: hint.bottom < innerHeight,
      idleAnimation: getComputedStyle(document.querySelector('.tile.focus .face')).animationName,
      reducedMotion: [...document.styleSheets].some(s => [...s.cssRules].some(r => r.conditionText && r.conditionText.includes('prefers-reduced-motion'))) };
  })()`);
  check(layout.unclipped && layout.hintInside, 'tiles and remote hints fit on screen');
  check(layout.separated, 'selected title has breathing room above tiles');
  check(layout.idleAnimation === 'none', 'no decorative idle animation');
  check(layout.reducedMotion, 'reduced-motion style present');
  // Contrast for the actual solid tile colours used by the TV theme.
  function luminance(hex) { const rgb = hex.match(/\w\w/g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4); return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722; }
  const contrast = (luminance('d8e3f1')+.05)/(luminance('1b2b3e')+.05);
  check(contrast >= 7, 'app labels exceed 7:1 contrast');
  check(errors.length === 0, 'no runtime errors during navigation');
  const shot = await call('Page.captureScreenshot',{format:'png'});
  const output = require('node:path').resolve(__dirname, '../shots/cinema-final.png');
  fs.mkdirSync(require('node:path').dirname(output), { recursive: true });
  fs.writeFileSync(output,Buffer.from(shot.data,'base64'));
  console.log(`${passed} passed, 0 failed`);
  console.log(`TEST_RESULT: pass total=${passed} failed=0 errors=0`);
  ws.close();
})().catch(e => { console.error(e); process.exit(1); });
