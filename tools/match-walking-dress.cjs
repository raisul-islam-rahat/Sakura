const fs=require('fs'),sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root='characters/girl/',actorPath=root+'actor.json';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
// Soft fabric-only mask: excludes warm skin, dark hair, and the red roses.
function fabric(r,g,b){return clamp((r-170)/35)*clamp((g-65)/30)*clamp((b-g-8)/22)*clamp((r-b-2)/18);}
function stats(data){const sum=[0,0,0];let weight=0;for(let i=0;i<data.length;i+=4){const w=fabric(data[i],data[i+1],data[i+2])*(data[i+3]/255);weight+=w;for(let k=0;k<3;k++)sum[k]+=data[i+k]*w;}return sum.map(x=>x/weight);}
(async()=>{const actor=JSON.parse(fs.readFileSync(actorPath)),ref=actor.sheets['girl-bouquet-pickup'],f=ref.frames[0],target=stats(await sharp(root+ref.image).extract({left:f.x,top:f.y,width:f.w,height:f.h}).ensureAlpha().raw().toBuffer());
console.log('Standing dress palette:',target.map(Math.round));
for(const [sheet,input,name]of [[actor,'walk-padded-alpha.png','walk-colour-matched.webp'],[actor.sheets['girl-bouquet-walk'],'bouquet-walk-fixed-alpha.png','bouquet-walk-colour-matched.webp']]){
 const {data,info}=await sharp(root+input).ensureAlpha().raw().toBuffer({resolveWithObject:true}),before=stats(data),delta=target.map((v,i)=>v-before[i]);
 for(let i=0;i<data.length;i+=4){const w=fabric(data[i],data[i+1],data[i+2]);for(let k=0;k<3;k++)data[i+k]=Math.round(clamp(data[i+k]+delta[k]*w,0,255));}
 await sharp(data,{raw:info}).webp({lossless:true,effort:6}).toFile(root+name);sheet.image=name;
 console.log(name,'before',before.map(Math.round),'after',stats(data).map(Math.round));
}
fs.writeFileSync(actorPath,JSON.stringify(actor,null,2)+'\n');})();
