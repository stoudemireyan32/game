/* Classic orthogonal link matching. No rendering or browser dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LinkEngine=api;})(globalThis,function(){
  'use strict';
  const dirs=[[-1,0],[0,1],[1,0],[0,-1]];
  function shuffle(items,rng=Math.random){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function coord(board,index){return {r:Math.floor(index/board.cols)+1,c:index%board.cols+1};}
  function at(board,r,c){if(r===0||c===0||r===board.rows+1||c===board.cols+1)return null;return board.cells[(r-1)*board.cols+c-1];}
  function findPath(board,a,b){
    const n=board.rows*board.cols;
    if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a>=n||b>=n||a===b||board.cells[a]===null||board.cells[a]!==board.cells[b])return null;
    const start=coord(board,a),target=coord(board,b),width=board.cols+2;
    const best=new Int8Array((board.rows+2)*width*4).fill(3);
    const queue=[{...start,dir:-1,turns:0,prev:-1}];
    for(let head=0;head<queue.length;head++){
      const cur=queue[head];
      for(let dir=0;dir<4;dir++){
        const turns=cur.turns+(cur.dir===-1||cur.dir===dir?0:1);
        if(turns>2)continue;
        const r=cur.r+dirs[dir][0],c=cur.c+dirs[dir][1];
        if(r<0||c<0||r>board.rows+1||c>board.cols+1)continue;
        const isEnd=r===target.r&&c===target.c;
        if(!isEnd&&at(board,r,c)!==null)continue;
        const key=(r*width+c)*4+dir;
        if(best[key]<=turns)continue;
        best[key]=turns;
        const node={r,c,dir,turns,prev:head};queue.push(node);
        if(isEnd){
          const path=[];let cursor=queue.length-1;
          while(cursor>=0){const p=queue[cursor];path.push({r:p.r,c:p.c});cursor=p.prev;}
          path.reverse();const corners=[path[0]];
          for(let i=1;i<path.length-1;i++)if((path[i].r-path[i-1].r)!==(path[i+1].r-path[i].r)||(path[i].c-path[i-1].c)!==(path[i+1].c-path[i].c))corners.push(path[i]);
          corners.push(path[path.length-1]);return corners;
        }
      }
    }
    return null;
  }
  function findMove(board){
    const groups=new Map();board.cells.forEach((t,i)=>{if(t!==null){if(!groups.has(t))groups.set(t,[]);groups.get(t).push(i);}});
    for(const ids of groups.values())for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const path=findPath(board,ids[i],ids[j]);if(path)return {a:ids[i],b:ids[j],path};}
    return null;
  }
  function assign(board,pairTypes,rng){
    const mask={rows:board.rows,cols:board.cols,cells:board.cells.map(t=>t===null?null:0)},sequence=[];
    let remaining=mask.cells.flatMap((t,i)=>t===null?[]:[i]);
    while(remaining.length){
      let found=null;
      for(const a of shuffle(remaining,rng)){
        for(const b of shuffle(remaining,rng))if(a!==b&&findPath(mask,a,b)){found=[a,b];break;}
        if(found)break;
      }
      if(!found)throw new Error('Cannot build a solvable link board');
      sequence.push(found);mask.cells[found[0]]=null;mask.cells[found[1]]=null;remaining=remaining.filter(i=>i!==found[0]&&i!==found[1]);
    }
    const values=shuffle(pairTypes,rng),cells=board.cells.map(()=>null);
    sequence.forEach(([a,b],i)=>{cells[a]=values[i];cells[b]=values[i];});
    return {rows:board.rows,cols:board.cols,cells,solution:sequence};
  }
  function generate(rows=6,cols=6,typeCount=6,rng=Math.random){
    if(!Number.isInteger(rows)||!Number.isInteger(cols)||rows<1||cols<1||rows*cols%2||rows*cols>80||typeCount<1)throw new Error('Invalid link board size');
    const pairTypes=Array.from({length:rows*cols/2},(_,i)=>i%typeCount);
    return assign({rows,cols,cells:Array(rows*cols).fill(0)},pairTypes,rng);
  }
  function reshuffle(board,rng=Math.random){
    const counts=new Map();for(const t of board.cells)if(t!==null)counts.set(t,(counts.get(t)||0)+1);
    const types=[];for(const [type,count] of counts){if(count%2)throw new Error('Unpaired tiles');for(let i=0;i<count/2;i++)types.push(type);}
    return assign(board,types,rng);
  }
  return {coord,findPath,findMove,generate,reshuffle};
});
