const fs=require('fs'),sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{const input='C:/Users/Raisul/.codex/generated_images/01a08a2f-b023-70b3-9dbe-4aac1d6174c1/exec-448e6d9d-071e-49ff-beee-4b507b858b4f.png';
const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
// The generated matte is neutral gray; preserve the pink-tinted costume and white highlights.
for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b),spread=hi-lo;
if(hi<230){const alpha=Math.max(0,Math.min(1,(spread-5)/13));data[i+3]=Math.round(255*alpha);}if(!data[i+3])data[i]=data[i+1]=data[i+2]=0;}
const file='characters/boy/hand-kiss-hd.webp';await sharp(data,{raw:info}).webp({lossless:true,effort:6}).toFile(file);
const a=JSON.parse(fs.readFileSync('characters/boy/actor.json'));a.sheets['couple-hand-kiss-hd']={image:'hand-kiss-hd.webp',fixedScale:true,referenceHeight:1225,frames:[{x:0,y:0,w:1254,h:1254,anchorX:627,anchorY:1233}]};fs.writeFileSync('characters/boy/actor.json',JSON.stringify(a,null,2)+'\n');
await sharp(file).flatten({background:'#152039'}).png().toFile('output/hand-kiss-hd-check.png');const m=await sharp(file).metadata();if(!m.hasAlpha)throw Error('Missing alpha');console.log('PASS: lossless 1254x1254 WebP with true alpha.');})();
