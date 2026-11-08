/* Adjacent-swap match-three engine; browser and Node share the same rules. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MatchEngine=api;})(globalThis,function(){
 'use strict';
 function adjacent(b,a,z){return Number.isInteger(a)&&Number.isInteger(z)&&a>=0&&z>=0&&a<b.cells.length&&z<b.cells.length&&Math.abs(Math.floor(a/b.cols)-Math.floor(z/b.cols))+Math.abs(a%b.cols-z%b.cols)===1;}
 function scan(b){const groups=[];function line(ids,axis){let start=0;while(start<ids.length){const first=b.cells[ids[start]];if(!first){start++;continue;}let end=start+1;while(end<ids.length&&b.cells[ids[end]]?.kind===first.kind)end++;if(end-start>=3)groups.push({ids:ids.slice(start,end),kind:first.kind,axis});start=end;}}
  for(let r=0;r<b.rows;r++)line(Array.from({length:b.cols},(_,c)=>r*b.cols+c),'row');
  for(let c=0;c<b.cols;c++)line(Array.from({length:b.rows},(_,r)=>r*b.cols+c),'col');
  return {groups,indices:[...new Set(groups.flatMap(g=>g.ids))]};
 }
 function swap(b,a,z){if(!adjacent(b,a,z))return false;[b.cells[a],b.cells[z]]=[b.cells[z],b.cells[a]];return true;}
 function isValidSwap(b,a,z){if(!adjacent(b,a,z)||!b.cells[a]||!b.cells[z])return false;if(b.cells[a].power||b.cells[z].power)return true;swap(b,a,z);const m=scan(b);swap(b,a,z);return m.indices.includes(a)||m.indices.includes(z);}
 function move(b){for(let a=0;a<b.cells.length;a++)for(const z of [a+1,a+b.cols])if(adjacent(b,a,z)&&isValidSwap(b,a,z))return {a,b:z};return null;}
 function shuffled(a,rng=Math.random){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
 function generate(rows,cols,types,make,rng=Math.random,intro=false){if(rows<3||cols<3||rows*cols>100||types<4)throw Error('Invalid board dimensions');for(let attempt=0;attempt<500;attempt++){const cells=[];for(let i=0;i<rows*cols;i++){const r=Math.floor(i/cols),c=i%cols;const options=Array.from({length:types},(_,n)=>n).filter(n=>!(c>=2&&cells[i-1].kind===n&&cells[i-2].kind===n)&&!(r>=2&&cells[i-cols].kind===n&&cells[i-cols*2].kind===n));cells.push(make(options[Math.floor(rng()*options.length)],''));}const b={rows,cols,cells};let tutorial=null;if(intro&&rows>=4&&cols>=6){const r=Math.min(2,rows-3),c=3;for(const at of [r*cols+1,r*cols+2,r*cols+4,(r+1)*cols+c])b.cells[at].kind=0;b.cells[r*cols+c].kind=1;for(const at of [r*cols,r*cols+5,(r-1)*cols+c,(r+2)*cols+c])if(b.cells[at].kind===0)b.cells[at].kind=2;tutorial={a:(r+1)*cols+c,b:r*cols+c};}if(!scan(b).indices.length&&move(b))return {...b,tutorial};}throw Error('Could not generate a stable board');}
 function shuffle(b,rng=Math.random){for(let n=0;n<1000;n++){const candidate={...b,cells:shuffled(b.cells,rng)};if(!scan(candidate).indices.length&&move(candidate))return candidate;}throw Error('Could not shuffle board');}
 function plan(b,matches,preferred=null,triggered=[],targetKind=null){const clear=new Set(matches.indices),creations=new Map();triggered.forEach(i=>clear.add(i));
  for(const g of matches.groups){if(g.ids.length<4)continue;let index=g.ids.includes(preferred)&&!b.cells[preferred]?.power?preferred:g.ids.find(i=>!b.cells[i]?.power);if(index===undefined)continue;const power=g.ids.length>=5?'color':g.axis;const old=creations.get(index);if(!old||power==='color')creations.set(index,{index,kind:g.kind,power});}
  const crosses=matches.indices.filter(i=>matches.groups.filter(g=>g.ids.includes(i)).length>1);for(const index of crosses)if(!b.cells[index]?.power)creations.set(index,{index,kind:b.cells[index].kind,power:'bomb'});
  const seen=new Set();for(const i of clear){const tile=b.cells[i];if(!tile?.power||seen.has(i))continue;seen.add(i);const r=Math.floor(i/b.cols),c=i%b.cols;
   if(tile.power==='row')for(let x=0;x<b.cols;x++)clear.add(r*b.cols+x);
   if(tile.power==='col')for(let y=0;y<b.rows;y++)clear.add(y*b.cols+c);
   if(tile.power==='bomb')for(let y=Math.max(0,r-1);y<=Math.min(b.rows-1,r+1);y++)for(let x=Math.max(0,c-1);x<=Math.min(b.cols-1,c+1);x++)clear.add(y*b.cols+x);
   if(tile.power==='color'){const kind=targetKind===null?tile.kind:targetKind;b.cells.forEach((t,k)=>{if(t?.kind===kind)clear.add(k);});}
  }
  return {clear:[...clear].filter(i=>b.cells[i]),creations:[...creations.values()],groups:matches.groups,activated:seen.size};
 }
 function refill(b,plan,types,make,rng=Math.random){const cells=b.cells.slice();plan.clear.forEach(i=>cells[i]=null);plan.creations.forEach(p=>cells[p.index]=make(p.kind,p.power));for(let c=0;c<b.cols;c++){const survivors=[];for(let r=b.rows-1;r>=0;r--){const t=cells[r*b.cols+c];if(t)survivors.push(t);}for(let r=b.rows-1;r>=0;r--)cells[r*b.cols+c]=survivors.length?survivors.shift():make(Math.floor(rng()*types),'');}return {...b,cells};}
 return {adjacent,scan,swap,isValidSwap,move,generate,shuffle,plan,refill};
});
