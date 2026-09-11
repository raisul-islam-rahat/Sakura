const fs=require('fs'),vm=require('vm');
const {createCanvas,loadImage}=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const source=fs.readFileSync('game.js','utf8'),scope={document:{createElement:()=>createCanvas(1,1)},clamp:(n,a,b)=>Math.max(a,Math.min(b,n))};
vm.createContext(scope);vm.runInContext(source.slice(source.indexOf('function actorSurface'),source.indexOf('async function loadActor')),scope);
(async()=>{const path='characters/boy/actor.json',a=JSON.parse(fs.readFileSync(path));
const sheets=[a,...Object.values(a.sheets),...(a.couple?[Object.assign(a.couple,{image:a.coupleImage})]:[])];
for(const s of sheets){if(s.chromaKey!=='green')continue;const im=await loadImage('characters/boy/'+s.image),out=scope.actorSurface(im,{...s,cleanEdges:true});const name=s.image.replace(/\.png$/,'-alpha.png');fs.writeFileSync('characters/boy/'+name,out.toBuffer('image/png'));s.image=name;delete s.chromaKey;delete s.cleanEdges;}
if(a.couple)a.coupleImage=a.couple.image;fs.writeFileSync(path,JSON.stringify(a,null,2)+'\n');console.log('All active boy/couple green sheets exported to transparent PNG.');})();
