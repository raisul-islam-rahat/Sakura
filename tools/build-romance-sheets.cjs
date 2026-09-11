const fs=require('fs'),sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root='C:/Users/Raisul/.codex/generated_images/01a08a2f-b023-70b3-9dbe-4aac1d6174c1/';
(async()=>{
const input=root+'exec-d9ff4800-6dc5-4d2e-8eca-21c66dcda457.png';
const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true}),{width:w,height:h}=info;
const solid=(x,y)=>{const i=(y*w+x)*4;return data[i+3]>128&&data[i+1]-Math.max(data[i],data[i+2])<60;};
const rows=[0];for(let r=1;r<6;r++){let best=Infinity,by=0;for(let y=Math.round(r*h/6)-45;y<=Math.round(r*h/6)+45;y++){let n=0;for(let x=0;x<w;x++)if(solid(x,y))n++;if(n<best){best=n;by=y;}}rows.push(by);}rows.push(h);
const patches=[],frames=[];
for(let r=0;r<6;r++)for(let c=0;c<6;c++){
 const left=Math.floor(c*w/6),right=Math.floor((c+1)*w/6);let x0=right,y0=rows[r+1],x1=left,y1=rows[r];
 for(let y=rows[r];y<rows[r+1];y++)for(let x=left;x<right;x++)if(solid(x,y)){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 const scale=Math.min(230/(y1-y0+1),236/(x1-x0+1)),pw=Math.round((x1-x0+1)*scale),ph=Math.round((y1-y0+1)*scale);
 const patch=await sharp(input).extract({left:x0,top:y0,width:x1-x0+1,height:y1-y0+1}).resize(pw,ph).png().toBuffer();
 patches.push({input:patch,left:c*256+246-pw,top:r*256+244-ph});frames.push({x:c*256,y:r*256,w:256,h:256,anchorX:c*256+128,anchorY:r*256+244});
}
await sharp({create:{width:1536,height:1536,channels:4,background:'#00ff00'}}).composite(patches).png().toFile('characters/boy/anime-dance-36.png');
const kiss=await sharp(root+'exec-da7d0f41-dc06-484d-ad7b-1d4996eb71ee.png').extract({left:0,top:512,width:1024,height:512}).toBuffer();
await sharp('characters/boy/anime-embrace.png').composite([{input:kiss,left:0,top:512}]).toFile('characters/boy/anime-embrace-kiss.png');
const p='characters/boy/actor.json',a=JSON.parse(fs.readFileSync(p));Object.assign(a.sheets['couple-dance'],{image:'anime-dance-36.png',referenceHeight:230,frames});a.sheets['couple-embrace'].image='anime-embrace-kiss.png';fs.writeFileSync(p,JSON.stringify(a,null,2)+'\n');
console.log('Built 36 aligned frames; row boundaries:',rows);
})().catch(e=>{console.error(e);process.exitCode=1});
