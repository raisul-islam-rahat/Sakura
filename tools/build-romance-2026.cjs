const fs=require('fs'),sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const sources=require('./romance-art-sources.json');
const clamp=(v)=>Math.max(0,Math.min(1,v));
(async()=>{const actorPath='characters/boy/actor.json',actor=JSON.parse(fs.readFileSync(actorPath));
for(const [name,keys]of [['couple-hand-kiss',['kiss-a','kiss-b']],['couple-dance',['dance-a','dance-b','dance-c','dance-d']]]){
 const composites=[],frames=[],cell=700,cols=4;
 for(const key of keys){const {data,info}=await sharp(sources[key]).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  // Remove saturated blue matte and spill before saving real alpha, once, losslessly.
  for(let p=0;p<data.length;p+=4){const neutral=Math.max(data[p],data[p+1]),excess=data[p+2]-neutral;
   if(excess>4)data[p+3]=Math.round(data[p+3]*(1-clamp((excess-4)/106)));
   if(excess>0)data[p+2]=neutral;
   if(data[p+1]>Math.max(data[p],data[p+2]))data[p+1]=Math.max(data[p],data[p+2]);
   if(data[p+3]<5)data[p]=data[p+1]=data[p+2]=data[p+3]=0;
  }
  for(let j=0;j<4;j++){const split=key==='dance-d'?582:Math.floor(info.height/2),left=Math.floor(j%2*info.width/2),top=j<2?0:split,width=Math.floor((j%2+1)*info.width/2)-left,height=j<2?split:info.height-split;
   let minX=width,maxX=0,minY=height,maxY=0;
   for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[((top+y)*info.width+left+x)*4+3]>128){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
   const index=frames.length,dx=index%cols*cell,dy=Math.floor(index/cols)*cell,px=Math.floor((cell-width)/2),py=cell-30-maxY;
   const input=await sharp(data,{raw:info}).extract({left,top,width,height}).png().toBuffer();composites.push({input,left:dx+px,top:dy+py});
   frames.push({x:dx,y:dy,w:cell,h:cell,anchorX:name==='couple-dance'?dx+420:dx+px+(minX+maxX)/2,anchorY:dy+cell-29,referenceHeight:name==='couple-hand-kiss'?maxY-minY+1:540});
  }
 }
 const file=name==='couple-hand-kiss'?'hand-kiss-new-8.webp':'dance-aligned-16.webp';
 await sharp({create:{width:cols*cell,height:Math.ceil(frames.length/cols)*cell,channels:4,background:'#00000000'}}).composite(composites).webp({lossless:true,effort:6}).toFile('characters/boy/'+file);
 actor.sheets[name]={image:file,fixedScale:true,referenceHeight:600,frames};console.log(file,frames.length,'fresh frames with alpha');
}
// Align the existing rise bridge to the girl's position/height in the new sheets.
for(const f of actor.sheets['couple-rise'].frames){f.anchorX=f.x+320;f.referenceHeight=635;}
fs.writeFileSync(actorPath,JSON.stringify(actor,null,2)+'\n');})();

