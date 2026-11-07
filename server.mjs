import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const files=new Set(['index.html','style.css','app.js','content.js','assets.html','research.html','assets/art-preview.png','assets/concept.png','assets/lab-scene.png','assets/game-sprites.png','assets/data-tiles.png']);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
http.createServer(async(req,res)=>{try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return}const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';if(!files.has(name))throw Error('not public');const data=await readFile(resolve(root,name));res.writeHead(200,{'Content-Type':mime[extname(name)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data)}catch{res.writeHead(404);res.end('Not found')}}).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('全民训练大模型 · port '+(process.env.PORT||3000)));
