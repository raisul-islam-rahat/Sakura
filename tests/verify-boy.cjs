const fs=require('fs'),vm=require('vm'),assert=require('assert');
const {createCanvas,loadImage}=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const src=fs.readFileSync('game.js','utf8'),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const canvas=createCanvas(1440,660),ctx=canvas.getContext('2d');
const c={clamp,mix,ease,assets:{},meta:{},ctx,document:{createElement:()=>createCanvas(1,1)},get:async p=>JSON.parse(fs.readFileSync(p)),image:loadImage};vm.createContext(c);
vm.runInContext(src.slice(src.indexOf('function actorSurface'),src.indexOf('const ready=')),c);
vm.runInContext(src.slice(src.indexOf('function sprite('),src.indexOf('function drawGirl')),c);
(async()=>{await c.loadActor('characters/boy','gentleman');for(const [name,m] of Object.entries(c.meta)){const im=c.assets[name];if(!im)continue;for(const f of m.frames){assert(f.x>=0&&f.y>=0&&f.x+f.w<=im.width&&f.y+f.h<=im.height,name+' bounds');}assert.equal(im.getContext('2d').getImageData(0,0,1,1).data[3],0,name+' background');}
ctx.fillStyle='#142039';ctx.fillRect(0,0,1440,660);ctx.fillStyle='#fff';ctx.font='18px sans-serif';ctx.fillText('Confident walk — facing the girl',15,25);ctx.fillText('Cake carried with supporting hands',15,350);
for(let i=0;i<8;i++){c.sprite('boy-walk',i,95+i*180,310,260,true);c.sprite('boy-carry',i,95+i*180,640,260,true);}
fs.writeFileSync('output/boy-walk-carry-preview.png',canvas.toBuffer('image/png'));
const poses=createCanvas(1100,360),pc=poses.getContext('2d');c.ctx=pc;pc.fillStyle='#142039';pc.fillRect(0,0,1100,360);for(let i=0;i<4;i++)c.sprite('gentleman',i,170+i*230,330,260,true);fs.writeFileSync('output/boy-poses-preview.png',poses.toBuffer('image/png'));
assert(!src.includes("prop(1,cinematic.boy"),'no detached cake');assert(src.includes("Math.abs(cinematic.boy-previousBoy)"),'distance gait');assert.equal(c.walkFrame('boy-walk',.3),2);assert.equal(c.walkFrame('boy-walk',1),0);
const sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const motion=createCanvas(640,360),mc=motion.getContext('2d'),pages=[];c.ctx=mc;
for(let n=0;n<48;n++){mc.fillStyle='#142039';mc.fillRect(0,0,640,360);mc.strokeStyle='#43546c';mc.beginPath();mc.moveTo(0,330);mc.lineTo(640,330);mc.stroke();mc.fillStyle='#5b6b82';for(let x=-80;x<720;x+=65)mc.fillRect(x+(n*130/24)%65,335,12,2);const frame=c.walkFrame('boy-walk',n/24);c.sprite('boy-walk',frame,190,330,260,true);c.sprite('boy-carry',frame,490,330,260,true);pages.push(Buffer.from(mc.getImageData(0,0,640,360).data));}
await sharp(Buffer.concat(pages),{raw:{width:640,height:360*48,channels:4,pageHeight:360}}).webp({quality:85,loop:0,delay:Array(48).fill(42)}).toFile('output/boy-motion-preview.webp');
Object.assign(c,{reduce:false,BASE:330,cinematic:{girl:150,boy:450,boyGait:.5},clock:1,face:1,drawGirl(){},glow(){},drawFlame(x,y){assert(Number.isFinite(x)&&Number.isFinite(y),'candle anchor');}});vm.runInContext(src.slice(src.indexOf('function romancePhase'),src.indexOf('function drawFlame')),c);for(const phase of ['arrival','kneel','approach','offer','hold','wait','walkAway','fetch','return','cakeReveal','cake','blow','tilt']){c.phase=phase;c.drawCinema(1);}console.log('PASS: all boy sheets loaded, bounds and chroma transparency, walking cycle indices, distance-driven gait and no detached cake draw');
})().catch(e=>{console.error(e);process.exitCode=1});
