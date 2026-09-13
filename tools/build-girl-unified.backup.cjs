const fs=require('fs'),sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const {root,sources}=require('./girl-unified-sources.json');
function neutralAlpha(d,w,h){const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);for(let p=0;p<w*h;p++){if(seen[p])continue;const eligible=p=>{const i=p*4;return Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2])<=5&&d[i]>100;};if(!eligible(p)){seen[p]=1;continue;}let head=0,end=1;queue[0]=p;seen[p]=1;let border=false;while(head<end){const q=queue[head++],x=q%w,y=Math.floor(q/w);if(x===0||y===0||x===w-1||y===h-1)border=true;for(const n of [x? q-1:-1,x<w-1?q+1:-1,y?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!seen[n]&&eligible(n)){seen[n]=1;queue[end++]=n;}}let dark=0,light=0;for(let k=0;k<end;k++){const v=d[queue[k]*4];if(v<220)dark++;if(v>240)light++;}const checker=end>25&&dark/end>.18&&light/end>.18;if(border||checker)for(let k=0;k<end;k++){const i=queue[k]*4;d[i]=d[i+1]=d[i+2]=d[i+3]=0;}}}
function keepCouple(d,w,h){const seen=new Uint8Array(w*h),q=new Int32Array(w*h);let best=[];for(let p=0;p<w*h;p++){if(seen[p]||d[p*4+3]<20)continue;let a=0,b=1;q[0]=p;seen[p]=1;while(a<b){const n=q[a++],x=n%w,y=Math.floor(n/w);for(const k of [x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1])if(k>=0&&!seen[k]&&d[k*4+3]>=20){seen[k]=1;q[b++]=k;}}if(b>best.length)best=Array.from(q.subarray(0,b));}const keep=new Uint8Array(w*h);for(const p of best){const x=p%w,y=Math.floor(p/w);for(let yy=Math.max(0,y-1);yy<=Math.min(h-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(w-1,x+1);xx++)keep[yy*w+xx]=1;}for(let p=0;p<w*h;p++)if(!keep[p])d[p*4]=d[p*4+1]=d[p*4+2]=d[p*4+3]=0;}
const W=640,H=720,baseline=660,targetHeight=480;
const rows={walk:520,bouquetWalk:518,pickup:565,bouquetPickup:569,handKiss:514,spin:521,lean:514,embrace:543,intro:514};
function cleanFragments(d,w,h){const seen=new Uint8Array(w*h),q=new Int32Array(w*h),parts=[];for(let p=0;p<w*h;p++){if(seen[p]||d[p*4+3]<24)continue;let a=0,b=1;q[0]=p;seen[p]=1;while(a<b){const n=q[a++],x=n%w,y=Math.floor(n/w);for(const k of [x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1])if(k>=0&&!seen[k]&&d[k*4+3]>=24){seen[k]=1;q[b++]=k;}}parts.push(Array.from(q.subarray(0,b)));}const max=Math.max(...parts.map(p=>p.length)),keep=new Uint8Array(w*h);for(const part of parts)if(part.length>max*.035)for(const p of part){const x=p%w,y=Math.floor(p/w);for(let yy=Math.max(0,y-1);yy<=Math.min(h-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(w-1,x+1);xx++)keep[yy*w+xx]=1;}for(let p=0;p<w*h;p++)if(!keep[p])d[p*4]=d[p*4+1]=d[p*4+2]=d[p*4+3]=0;}
async function makeFrames(kind){const file=root+sources[kind],m=await sharp(file).metadata(),solo=['walk','bouquetWalk','pickup','bouquetPickup'].includes(kind),bending=kind==='pickup'||kind==='bouquetPickup'||kind==='lean',out=[];let firstScale,firstFace;
for(let j=0;j<8;j++){const edges=kind==='lean'?(j<4?[0,400,788,1168,m.width]:[0,438,811,1155,m.width]):kind==='intro'?[0,400,778,1157,m.width]:[0,384,768,1152,m.width],left=edges[j%4],top=kind==='handKiss'&&j===7?500:j<4?0:rows[kind],w=edges[j%4+1]-left,h=j<4?rows[kind]:m.height-top;
const {data:d}=await sharp(file).extract({left,top,width:w,height:h}).ensureAlpha().raw().toBuffer({resolveWithObject:true});if(!m.hasAlpha)neutralAlpha(d,w,h);if(kind==='intro')cleanFragments(d,w,h);else keepCouple(d,w,h);
let head=h,bottom=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=(y*w+x)*4;if(d[p+3]<160)continue;if(solo||x<w*.64){if(d[p]>d[p+1]+12&&d[p+2]>d[p+1]+8&&d[p]<185)head=Math.min(head,y);if(y>h*.5&&d[p]>d[p+1]+20&&d[p+2]>d[p+1]+8)bottom=Math.max(bottom,y);}}
if(head>=bottom)throw Error('Girl measurement failed '+kind+j);
let sum=0,n=0;for(let y=head;y<Math.min(h,head+(bottom-head)*.22);y++)for(let x=0;x<w*(solo?1:.64);x++){const p=(y*w+x)*4;if(d[p+3]>180&&d[p]>170&&d[p+1]>90&&d[p]>d[p+1]+15&&d[p+2]<d[p+1]+25){sum+=x;n++;}}
const face=n?sum/n:w*.55;if(j===0){firstScale=targetHeight/(bottom-head+1);firstFace=face;}
const scale=bending?firstScale:targetHeight/(bottom-head+1),anchor=solo?350:320,pivot=solo?350:235;
const nw=Math.round(w*scale),nh=Math.round(h*scale),x=Math.round(pivot-(bending?firstFace:face)*scale),y=Math.round(baseline-(bottom+1)*scale);
if(x<0||y<0||x+nw>W||y+nh>H)throw Error('Padding '+kind+j+' '+[x,y,nw,nh]);
let handX=face,handY=head+(bottom-head)*.55;
if(kind==='pickup'||kind==='bouquetPickup'){let best=-1,ys=0,count=0;for(let yy=Math.floor(head+(bottom-head)*.32);yy<Math.min(h,j<4?head+(bottom-head)*.73:bottom+5);yy++)for(let xx=0;xx<w;xx++){const z=(yy*w+xx)*4;if(d[z+3]>180&&d[z]>175&&d[z+1]>95&&d[z]>d[z+1]+12&&d[z+2]<d[z+1]+20){if(xx>best){best=xx;ys=yy;count=1;}else if(xx===best){ys+=yy;count++;}}}if(best>=0){handX=best;handY=ys/count;}}
const input=await sharp(d,{raw:{width:w,height:h,channels:4}}).resize(nw,nh).png().toBuffer();out.push({input:await sharp({create:{width:W,height:H,channels:4,background:'#00000000'}}).composite([{input,left:x,top:y}]).png().toBuffer(),anchor,handX:x+handX*scale,handY:y+handY*scale});}
return out;}
(async()=>{const all={};for(const kind of Object.keys(sources)){all[kind]=await makeFrames(kind);console.log('Normalized '+kind);}
all.spin[0]=all.handKiss[7];all.lean[0]=all.spin[7];all.embrace[0]=all.lean[7];
const girl=JSON.parse(fs.readFileSync('characters/girl/actor.json')),boy=JSON.parse(fs.readFileSync('characters/boy/actor.json'));fs.mkdirSync('output/girl-unified',{recursive:true});
for(const [kind,frames]of Object.entries(all)){const solo=['walk','bouquetWalk','pickup','bouquetPickup'].includes(kind),folder=solo?'characters/girl':'characters/boy',name='unified-'+kind+'.webp';await sharp({create:{width:W*4,height:H*2,channels:4,background:'#00000000'}}).composite(frames.map((f,i)=>({input:f.input,left:i%4*W,top:Math.floor(i/4)*H}))).webp({lossless:true,effort:6}).toFile(folder+'/'+name);
const meta={image:name,fixedScale:true,referenceHeight:targetHeight,frames:frames.map((f,i)=>({x:i%4*W,y:Math.floor(i/4)*H,w:W,h:H,anchorX:i%4*W+f.anchor,anchorY:Math.floor(i/4)*H+baseline,handX:i%4*W+f.handX,handY:Math.floor(i/4)*H+f.handY}))};
if(kind==='walk'){Object.assign(girl,meta,{displayHeight:245,cycleSeconds:1,walkFrames:[0,1,2,3,4,5,6,7],strideDistance:150});}
else if(kind==='pickup'){girl.pickup={...meta,duration:2.8};}
else if(kind==='bouquetWalk'){girl.sheets['girl-bouquet-walk']={...meta,cycleSeconds:1,walkFrames:[0,1,2,3,4,5,6,7],strideDistance:150};}
else if(kind==='bouquetPickup'){girl.sheets['girl-bouquet-pickup']={...meta,duration:2.8};}
else boy.sheets[{handKiss:'couple-hand-kiss',spin:'couple-dance',lean:'couple-dance-lean',embrace:'couple-embrace',intro:'intro-giving'}[kind]]=meta;
await sharp(folder+'/'+name).flatten({background:'#17243b'}).resize(1280).png().toFile('output/girl-unified/'+kind+'.png');}
// No active phase uses these legacy girl/couple drawings after the hand-kiss rise.
delete boy.sheets['couple-rise'];delete boy.coupleImage;delete boy.couple;
fs.writeFileSync('characters/girl/actor.json',JSON.stringify(girl,null,2)+'\n');fs.writeFileSync('characters/boy/actor.json',JSON.stringify(boy,null,2)+'\n');})();





