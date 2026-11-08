import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
let html=await readFile(resolve(root,'index.html'),'utf8');
const css=await readFile(resolve(root,'style.css'),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+css+'</style>');
let progress=[];try{progress=(await readFile(resolve(root,'docs/progress.jsonl'),'utf8')).trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));}catch(error){if(error.code!=='ENOENT')throw error;}
let scripts='window.GAME_PROGRESS='+JSON.stringify(progress.slice(-24)).replace(/</g,'\\u003c')+';\n';
for(const name of ['engine.js','economy.js','content.js','music.js','app.js']){const js=await readFile(resolve(root,name),'utf8');if(/<\/script/i.test(js))throw new Error('Unsafe inline script closing sequence in '+name);scripts+='\n/* '+name+' */\n'+js;html=html.replace('<script src="'+name+'"></script>','');}
html=html.replace('</body>',()=>'<script>'+scripts+'</script></body>');
if(/<script\b[^>]*\bsrc=|<link\b[^>]*rel="stylesheet"|<img\b|@import\b/.test(html))throw new Error('The playable must have no external startup assets');
await writeFile(resolve(root,'play.html'),html);console.log('Built play.html: '+new TextEncoder().encode(html).length+' bytes; no external startup assets');
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const journal='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>全民训练大模型 · 云端制作日志</title><style>body{margin:0;background:#291b40;color:#f5e6da;font:14px system-ui,sans-serif}main{max-width:760px;margin:auto;padding:26px 20px 60px}h1{font-size:26px}p{font-size:12px;line-height:1.9;color:#cbb2d8}a{color:#c7edb6}.tag{font-size:9px;letter-spacing:2px;color:#c8abd7}article{border:1px solid #9272a565;background:#3d2952;border-radius:14px;margin:15px 0;padding:15px}time{color:#ddedb5;font-size:12px;font-weight:700}article p{margin:8px 0 0}.play{display:inline-block;padding:11px 16px;background:#c6e8a6;border-radius:10px;color:#35593e;text-decoration:none;font-weight:800;margin:15px 0}</style></head><body><main><span class="tag">CLOUD EXECUTION · ASIA/SHANGHAI</span><h1>云端制作日志</h1><p>以下为实际执行节点，时间均为北京时间。记录了完成内容、发现的问题和复测结果。这是发布版本的日志快照，不是实时在线状态监控。浏览器检查使用云端 Chromium 的手机触控模拟，不冒充真实手机硬件测试。</p><a class="play" href="play.html">打开《全民训练大模型》滑动三消 →</a>'+progress.map(x=>'<article><time>'+escapeHtml(x.beijing)+'</time><p>'+escapeHtml(x.message)+'</p></article>').join('')+'</main></body></html>';
await writeFile(resolve(root,'progress.html'),journal);
