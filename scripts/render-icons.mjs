// Renders assets/images/icon-source.mjs to the PNGs the app ships, using the
// installed Microsoft Edge in headless mode (no extra packages).
//   node scripts/render-icons.mjs [outDir]
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { outputs } from '../assets/images/icon-source.mjs';

const OUT = resolve(process.argv[2] ?? 'assets/images');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = 9334;
const profile = mkdtempSync(join(tmpdir(), 'nl-icons-'));
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
  } catch {}
  if (!wsUrl) await sleep(200);
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, (m) => (m.error ? reject(new Error(m.error.message)) : resolve(m.result)));
    ws.send(JSON.stringify({ id: n, method, params }));
  });

await send('Page.enable');
for (const o of outputs) {
  await send('Emulation.setDeviceMetricsOverride', { width: o.size, height: o.size, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: o.transparent ? 0 : 1 } });
  const html = `<!doctype html><html><body style="margin:0;background:transparent">${o.svg.replace('width="1024" height="1024"', `width="${o.size}" height="${o.size}"`)}</body></html>`;
  await send('Page.navigate', { url: 'data:text/html;base64,' + Buffer.from(html).toString('base64') });
  await sleep(600);
  const { data } = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: o.size, height: o.size, scale: 1 } });
  writeFileSync(join(OUT, o.file), Buffer.from(data, 'base64'));
  console.log('wrote', o.file, `${o.size}px`);
}
ws.close();
edge.kill();
await sleep(1000);
try {
  rmSync(profile, { recursive: true, force: true });
} catch {}
process.exit(0);
