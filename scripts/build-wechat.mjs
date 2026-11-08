import {mkdir,cp,writeFile,readFile,stat,readdir,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),out=resolve(root,'wechat'),prepared=resolve(root,'dist/wechat-preparation');
try{await stat(resolve(prepared,'manifest.json'));}catch{throw Error('Run npm run prepare:wechat first');}
for(const dir of ['core','images','audio','licenses'])await cp(resolve(prepared,dir),resolve(out,dir),{recursive:true});
const manifest=JSON.parse(await readFile(resolve(prepared,'manifest.json'),'utf8'));await writeFile(resolve(out,'assets.js'),'module.exports='+JSON.stringify({brands:manifest.brands,gpus:manifest.gpus,models:manifest.models},null,2)+';\n');await rm(resolve(out,'assets.json'),{force:true});
// Short original match/power chimes complement the prerecorded announcer.
for(const [key,frequencies] of [['match',[1047,1319,1568]],['power',[660,990,1320,1980]]]){
 const expr=frequencies.map((f,i)=>`if(gte(t,${i*.045}),0.13*sin(2*PI*${f}*(t-${i*.045}))*exp(-22*(t-${i*.045})),0)`).join('+');
 execFileSync('ffmpeg',['-v','error','-y','-f','lavfi','-i',`aevalsrc=${expr.replaceAll(',', '\\,')}:s=22050:d=0.4`,'-ac','1','-c:a','libmp3lame','-b:a','48k',resolve(out,'audio',key+'.mp3')]);
}
let files=0,bytes=0;async function count(dir){for(const f of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,f.name);if(f.isDirectory())await count(p);else{files++;bytes+=(await stat(p)).size;}}}await count(out);
console.log(JSON.stringify({directory:out,appid:JSON.parse(await readFile(resolve(out,'project.config.json'),'utf8')).appid,files,bytes,canvas2D:true,realWeChatDeviceVerified:false}));
