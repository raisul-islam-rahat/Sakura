const fs=require('fs'),vm=require('vm'),assert=require('assert');
const {createCanvas,loadImage}=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const src=fs.readFileSync('game.js','utf8'),c={clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),document:{createElement:()=>createCanvas(1,1)},assets:{},meta:{},image:loadImage,get:async p=>JSON.parse(fs.readFileSync(p))};
vm.createContext(c);vm.runInContext(src.slice(src.indexOf('function actorSurface'),src.indexOf('const ready=')),c);
vm.runInContext(src.slice(src.indexOf('function sprite('),src.indexOf('function drawGirl(')),c);
(async()=>{await c.loadActor('characters/girl','girl-walk');
for(const name of ['girl-walk','girl-bouquet-walk','girl-bouquet-pickup']){const im=c.assets[name],surface=createCanvas(im.width,im.height),gc=surface.getContext('2d');gc.drawImage(im,0,0);const d=gc.getImageData(0,0,im.width,im.height).data;
for(let i=0;i<d.length;i+=4)if(d[i+3]>8)assert(d[i+1]<=Math.max(d[i],d[i+2])+2,name+' green fringe');
if(c.meta[name].alignWalkFrames)for(const f of c.meta[name].frames)assert(f.referenceHeight>200&&f.anchorY<=f.y+f.h);}
const out=createCanvas(1000,360);c.ctx=out.getContext('2d');c.ctx.fillStyle='#152039';c.ctx.fillRect(0,0,1000,360);
for(const [i,name]of ['girl-walk','girl-bouquet-walk','girl-bouquet-pickup'].entries())c.sprite(name,0,250+i*320,310,245);
fs.writeFileSync('output/girl-clean-edges.png',out.toBuffer('image/png'));
console.log('PASS: all girl sheets free of green spill; walking heights and feet aligned.');
})().catch(e=>{console.error(e);process.exitCode=1});
