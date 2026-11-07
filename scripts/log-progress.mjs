import {appendFile,mkdir,access,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const message=process.argv.slice(2).join(' ');if(!message)throw new Error('A real progress message is required');
const now=new Date();
const stamp=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);
await mkdir(resolve(root,'docs'),{recursive:true});
const md=resolve(root,'docs/progress-log.md');try{await access(md);}catch{await writeFile(md,'# 全民训练大模型 · 云端执行日志\n\n以下时间为北京时间（Asia/Shanghai），按实际完成节点记录，不补造历史时间。\n\n');}
await appendFile(md,`- **${stamp}** — ${message}\n`);
await appendFile(resolve(root,'docs/progress.jsonl'),JSON.stringify({utc:now.toISOString(),beijing:stamp,message})+'\n');
console.log(`[北京时间 ${stamp}] ${message}`);
