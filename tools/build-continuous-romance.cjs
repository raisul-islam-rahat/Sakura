const fs=require('fs'),sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const sources=require('./continuous-romance-sources.json');
const cellW=640,cellH=540,baseline=510,bodyHeight=430;
async function framesFrom(path){const {data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let i=0;i<data.length;i+=4){const neutral=Math.max(data[i],data[i+2]),excess=data[i+1]-neutral;if(excess>4)data[i+3]*=1-Math.max(0,Math.min(1,(excess-4)/100));if(excess>0)data[i+1]=neutral;if(data[i+3]<5)data[i]=data[i+1]=data[i+2]=data[i+3]=0;}
const result=[];
for(let j=0;j<8;j++){
 const left=Math.floor(j%4*info.width/4),top=Math.floor(Math.floor(j/4)*info.height/2),width=Math.floor((j%4+1)*info.width/4)-left,height=Math.floor((Math.floor(j/4)+1)*info.height/2)-top;
 const {data:pixels,info:region}=await sharp(data,{raw:info}).extract({left,top,width,height}).raw().toBuffer({resolveWithObject:true});
 let minY=height,maxY=0;for(let y=0;y<height;y++)for(let x=0;x<width*.52;x++)if(pixels[(y*width+x)*4+3]>160){minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
 let faceSum=0,count=0;for(let y=minY;y<minY+(maxY-minY)*.23;y++)for(let x=0;x<width*.52;x++){const i=(y*width+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];if(pixels[i+3]>180&&r>170&&g>90&&r>g+15&&b<g+20){faceSum+=x;count++;}}
 if(count<20)throw Error('Cannot align face in frame '+j+' '+path);
 const scale=bodyHeight/(maxY-minY+1),w=Math.round(width*scale),h=Math.round(height*scale),x=Math.round(230-faceSum/count*scale),y=Math.round(baseline-(maxY+1)*scale);
 if(x<0||y<0||x+w>cellW||y+h>cellH)throw Error('Pose padding insufficient: '+j);
 const input=await sharp(pixels,{raw:region}).resize(w,h,{kernel:'lanczos3'}).png().toBuffer();result.push(await sharp({create:{width:cellW,height:cellH,channels:4,background:'#00000000'}}).composite([{input,left:x,top:y}]).png().toBuffer());
}
return result;}
(async()=>{const kiss=await framesFrom(sources.kiss),dance=await framesFrom(sources.dance);
// The seam is literally the same image, not two approximate poses.
dance[0]=kiss[7];
const a=JSON.parse(fs.readFileSync('characters/boy/actor.json'));
for(const [key,name,frames]of [['couple-hand-kiss','hand-kiss-continuous-8.webp',kiss],['couple-dance','dance-continuous-8.webp',dance]]){
 await sharp({create:{width:cellW*4,height:cellH*2,channels:4,background:'#00000000'}}).composite(frames.map((input,i)=>({input,left:i%4*cellW,top:Math.floor(i/4)*cellH}))).webp({lossless:true,effort:6}).toFile('characters/boy/'+name);
 a.sheets[key]={image:name,fixedScale:true,referenceHeight:bodyHeight,frames:frames.map((_,i)=>({x:i%4*cellW,y:Math.floor(i/4)*cellH,w:cellW,h:cellH,anchorX:i%4*cellW+320,anchorY:Math.floor(i/4)*cellH+baseline}))};
}
fs.writeFileSync('characters/boy/actor.json',JSON.stringify(a,null,2)+'\n');console.log('Built two aligned eight-pose atlases with identical kiss/dance seam.');})();
