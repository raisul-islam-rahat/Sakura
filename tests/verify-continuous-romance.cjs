const fs=require('fs'),assert=require('assert'),crypto=require('crypto'),sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{const a=require('../characters/boy/actor.json'),frames=[],tiles=[];
for(const name of ['couple-hand-kiss','couple-dance','couple-dance-lean']){const s=a.sheets[name],m=await sharp('characters/boy/'+s.image).metadata();assert(m.hasAlpha);assert.equal(s.frames.length,8);const hashes=new Set();
for(const f of s.frames){const {data,info}=await sharp('characters/boy/'+s.image).extract({left:f.x,top:f.y,width:f.w,height:f.h}).ensureAlpha().raw().toBuffer({resolveWithObject:true});for(let p=0;p<data.length;p+=4)if(data[p+3]===0)data[p]=data[p+1]=data[p+2]=0;hashes.add(crypto.createHash('sha256').update(data).digest('hex'));let visible=0;
for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const p=(y*info.width+x)*4;if(data[p+3]>20){visible++;assert(x>5&&y>5&&x<info.width-6&&y<info.height-6,'Clipped pose');assert(!(data[p+1]>Math.max(data[p],data[p+2])+35),'Green fringe');}}
assert(visible>10000);frames.push(data);const input=await sharp(data,{raw:info}).flatten({background:'#17223a'}).resize(320,320).png().toBuffer(),i=tiles.length;tiles.push({input,left:i%4*320,top:Math.floor(i/4)*320});}
assert.equal(hashes.size,8,'Every pose is distinct');}
assert(frames[15].equals(frames[16]),'Spin/lean seam identical');
assert(frames[7].equals(frames[8]),'Hand-kiss/dance seam must be pixel identical');
await sharp({create:{width:1280,height:1920,channels:4,background:'#17223a'}}).composite(tiles).png().toFile('output/continuous-romance-contact.png');
await sharp(Buffer.concat(frames),{raw:{width:640,height:640*24,channels:4,pageHeight:640}}).webp({lossless:true,loop:0,delay:[650,650,750,900,1100,900,700,750,...Array(16).fill(500)]}).toFile('output/continuous-romance-playback.webp');
console.log('PASS: Eight distinct poses per sheet across three sheets, true alpha, clear borders, no green fringe, pixel-identical hand-kiss/dance seam.');})();
