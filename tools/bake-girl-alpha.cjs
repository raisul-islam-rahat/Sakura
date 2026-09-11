// Bake the existing clean renderer output into PNG alpha, preserving exact poses.
const fs=require('fs'),vm=require('vm');
const {createCanvas,loadImage}=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const source=fs.readFileSync('game.js','utf8'),scope={document:{createElement:()=>createCanvas(1,1)},clamp:(n,a,b)=>Math.max(a,Math.min(b,n))};
vm.createContext(scope);vm.runInContext(source.slice(source.indexOf('function actorSurface'),source.indexOf('async function loadActor')),scope);
(async()=>{const path='characters/girl/actor.json',actor=JSON.parse(fs.readFileSync(path));
for(const sheet of [actor,...Object.values(actor.sheets)]){
 if(sheet.chromaKey!=='green')continue;
 const im=await loadImage('characters/girl/'+sheet.image),out=scope.actorSurface(im,sheet);
 const name=sheet.image.replace(/\.png$/,'-alpha.png');fs.writeFileSync('characters/girl/'+name,out.toBuffer('image/png'));
 sheet.image=name;delete sheet.chromaKey;delete sheet.cleanEdges;delete sheet.alignWalkFrames;
}
fs.writeFileSync(path,JSON.stringify(actor,null,2)+'\n');console.log('Saved real RGBA sheets and removed runtime green keying.');})();
