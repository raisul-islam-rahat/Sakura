const fs=require('fs'),sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const {createCanvas,loadImage}=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const jobs=require('./gift-sticker-sources.json');
(async()=>{fs.mkdirSync('assets/gifts/stickers',{recursive:true});const gallery=[];
for(const job of jobs){const metadata=await sharp(job.source).metadata();
 for(let index=0;index<job.items.length;index++){
  const left=Math.floor(index%job.cols*metadata.width/job.cols),top=Math.floor(Math.floor(index/job.cols)*metadata.height/job.rows),width=Math.floor((index%job.cols+1)*metadata.width/job.cols)-left,height=Math.floor((Math.floor(index/job.cols)+1)*metadata.height/job.rows)-top;
  const {data,info}=await sharp(job.source).extract({left,top,width,height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(!metadata.hasAlpha)for(let i=0;i<data.length;i+=4){const excess=data[i+1]-Math.max(data[i],data[i+2]);if(excess>4){data[i+3]*=1-Math.max(0,Math.min(1,(excess-4)/100));data[i+1]=Math.max(data[i],data[i+2]);}}
  // Keep the single die-cut object, removing isolated generation specks outside its edge.
  const n=width*height,seen=new Uint8Array(n),queue=new Int32Array(n);let largest=[];
  for(let p=0;p<n;p++){if(seen[p]||data[p*4+3]<12)continue;let tail=1;queue[0]=p;seen[p]=1;
   for(let head=0;head<tail;head++){const q=queue[head],x=q%width,y=Math.floor(q/width);for(const next of [x? q-1:-1,x<width-1?q+1:-1,y?q-width:-1,y<height-1?q+width:-1])if(next>=0&&!seen[next]&&data[next*4+3]>=12){seen[next]=1;queue[tail++]=next;}}
   if(tail>largest.length)largest=queue.slice(0,tail);
  }
  const keep=new Uint8Array(n);let x0=width,y0=height,x1=0,y1=0;for(const p of largest){keep[p]=1;const x=p%width,y=Math.floor(p/width);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  for(let p=0;p<n;p++)if(!keep[p])data[p*4]=data[p*4+1]=data[p*4+2]=data[p*4+3]=0;
  const buffer=await sharp(data,{raw:info}).extract({left:x0,top:y0,width:x1-x0+1,height:y1-y0+1}).png().toBuffer();const im=await loadImage(buffer),pad=20,out=createCanvas(im.width+pad*2,im.height+pad*2),ctx=out.getContext('2d'),mask=createCanvas(im.width,im.height),mc=mask.getContext('2d');
  mc.drawImage(im,0,0);mc.globalCompositeOperation='source-in';mc.fillStyle='#fff';mc.fillRect(0,0,im.width,im.height);
  // A continuous white contour, not a rectangular border.
  for(let angle=0;angle<Math.PI*2;angle+=Math.PI/12)ctx.drawImage(mask,pad+Math.cos(angle)*3,pad+Math.sin(angle)*3);ctx.drawImage(im,pad,pad);
  const file=`assets/gifts/stickers/gift-${String(job.number).padStart(2,'0')}-${index+1}.webp`;await sharp(out.toBuffer('image/png')).webp({lossless:true,effort:6}).toFile(file);
  const tile=await sharp(file).resize(190,190,{fit:'contain',background:'#ecd9e200'}).png().toBuffer(),i=gallery.length;gallery.push({input:tile,left:i%6*200+5,top:Math.floor(i/6)*200+5});
 }
 console.log('Letter',job.number,job.items.length,'separate transparent stickers');
}
await sharp({create:{width:1200,height:Math.ceil(gallery.length/6)*200,channels:4,background:'#d7bdce'}}).composite(gallery).png().toFile('output/gift-sticker-gallery.png');
})();
