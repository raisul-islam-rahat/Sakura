(() => {
'use strict';
// Progress lives only in memory. Remove the save left by earlier versions.
try{localStorage.removeItem(window.BIRTHDAY_CONFIG.storageKey||'muno-sakura-cinematic-v2');}catch{}
// A browser back/forward restoration should also start a fresh journey.
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
const C=window.BIRTHDAY_CONFIG,$=id=>document.getElementById(id),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,density=reduce?.25:clamp(C.animationDensity||1,.3,1.5);
const canvas=$('scene'),ctx=canvas.getContext('2d');
let W=390,H=844,V=462,S=.844,assets={},meta={},backgrounds=[],letters=[],loaded=false,loadError=null;
let WORLD=19800,END=19150,segmentWidth=3000,overlap=200;
const START=125,BOUQUET=340,BASE=867;
let phase='entrance',clock=0,total=0,x=START,velocity=0,input=0,camera=0,gait=0,face=1,carrying=false,collected=new Set(),passed=new Set(),completed=false,manualPause=false,muted=false,active=false,near=null;
let flowerIntro={state:'idle',boy:0,start:0,from:START};
let pointer=null,keys=new Set(),modalLetter=null,toastTimer,pickup=null;
let cinematic={girl:0,boy:0,startGirl:0,boyStart:0},petals=[],stars=[],sparks=[],rockets=[],fireworkTimer=0,wind=0,mini=null,fireworkBeat=0,blooms=[],petalBursts=[],lastEffectCamera=0;
const finaleVideo=$('finale-video');
const bg=new Audio(C.backgroundMusic),song=new Audio(),audioFiles=[bg,song];bg.loop=song.loop=true;bg.volume=C.musicVolume??.22;song.volume=.25;let ac;
function play(a){const p=a.play();if(p)p.catch(()=>{});}
function soundSync(){if(phase==='video'){audioFiles.forEach(a=>a.pause());if(document.hidden||manualPause)finaleVideo.pause();return;}audioFiles.forEach(a=>{a.muted=muted;});if(!active||document.hidden||manualPause||muted){audioFiles.forEach(a=>a.pause());return;}if(modalLetter?.music){bg.pause();play(song);}else{song.pause();play(bg);}}
function chime(kind='heart'){
 if(muted||reduce)return;
 try{ac??=new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const t=ac.currentTime;
 if(kind==='wind'){const buffer=ac.createBuffer(1,ac.sampleRate*1.6,ac.sampleRate),d=buffer.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.17;const src=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();filter.type='lowpass';filter.frequency.value=900;src.buffer=buffer;src.connect(filter);filter.connect(gain);gain.connect(ac.destination);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.35,t+.25);gain.gain.exponentialRampToValueAtTime(.001,t+1.5);src.start(t);return;}
 const notes=kind==='win'?[523,659,784,1047]:kind==='tap'?[660]:[784,988];notes.forEach((f,i)=>{const osc=ac.createOscillator(),gain=ac.createGain();osc.type='sine';osc.frequency.value=f;gain.gain.setValueAtTime(.0001,t+i*.1);gain.gain.exponentialRampToValueAtTime(.07,t+i*.1+.01);gain.gain.exponentialRampToValueAtTime(.0001,t+i*.1+.8);osc.connect(gain);gain.connect(ac.destination);osc.start(t+i*.1);osc.stop(t+i*.1+.9);});
 }catch{}
}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3300);}
function norm(a){return String(a).trim().toLowerCase().replace(/\s+/g,' ');}
async function get(url,type='json'){const r=await fetch(url,{cache:'no-cache'});if(!r.ok)throw new Error(`${url}: ${r.status}`);return type==='json'?r.json():r.text();}
function image(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(`Missing image: ${src}`));img.src=src;});}
async function letter(folder,i){const l=await get(`${folder}/letter.json`);const [message,animation,gate]=await Promise.all([get(`${folder}/${l.text||'message.txt'}`,'text'),get(`${folder}/${l.animation||'animation.json'}`),l.challengeEnabled===false?Promise.resolve(null):get(`${folder}/${l.challenge||'challenge.json'}`)]);return {...l,folder,message,animation,gate,x:1050+i*(6050/Math.max(1,C.letters.length-1)),picture:l.picture?`${folder}/${l.picture}`:null,music:l.music?`${folder}/${l.music}`:null};}
function defaultFrames(img,actor){const cols=actor.columns||1,rows=actor.rows||1,fw=img.width/cols,fh=img.height/rows;return Array.from({length:cols*rows},(_,i)=>({x:(i%cols)*fw,y:Math.floor(i/cols)*fh,w:fw,h:fh,anchorX:(i%cols)*fw+fw*.55,anchorY:Math.floor(i/cols)*fh+fh*.98}));}
function actorSurface(im,settings){
 if(settings.chromaKey!=='green')return im;
 const layer=document.createElement('canvas');layer.width=im.width;layer.height=im.height;
 const gc=layer.getContext('2d');gc.drawImage(im,0,0);const pixels=gc.getImageData(0,0,layer.width,layer.height),d=pixels.data;
 for(let i=0;i<d.length;i+=4){const neutral=Math.max(d[i],d[i+2]),excess=d[i+1]-neutral;if(settings.cleanEdges!==false){
  // Remove the green matte and its antialiased spill before canvas scaling.
  if(excess>8)d[i+3]*=1-clamp((excess-8)/77,0,1);
  if(excess>0)d[i+1]=neutral;
  if(d[i+3]<4)d[i]=d[i+1]=d[i+2]=d[i+3]=0;
 }else if(excess>30){d[i+3]*=1-clamp((excess-30)/65,0,1);d[i+1]=Math.min(d[i+1],neutral+15);}}
 if(settings.alignWalkFrames&&settings.frames)for(const f of settings.frames){
  let top=f.y+f.h,bottom=f.y-1;
  for(let y=f.y;y<f.y+f.h;y++)for(let x=f.x;x<f.x+f.w;x++)if(d[(y*layer.width+x)*4+3]>128){top=Math.min(top,y);bottom=Math.max(bottom,y);}
  if(bottom>=top){f.anchorY=bottom+1;f.referenceHeight=bottom-top+1;}
 }
 gc.putImageData(pixels,0,0);return layer;
}
async function loadActor(folder,key){const actor=await get(`${folder}/actor.json`);assets[key]=actorSurface(await image(`${folder}/${actor.image}`),actor);actor.frames=actor.frames?.length?actor.frames:defaultFrames(assets[key],actor);meta[key]=actor;if(actor.pickup){const p=actor.pickup;let im=await image(folder+'/'+p.image);if(p.removeNeutralBackdrop){const layer=document.createElement('canvas');layer.width=im.width;layer.height=im.height;const gc=layer.getContext('2d');gc.drawImage(im,0,0);const pixels=gc.getImageData(0,0,layer.width,layer.height);for(let i=0;i<pixels.data.length;i+=4){const d=pixels.data,spread=Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2]);if(d[i]<=d[i+1]+2&&d[i]<=d[i+2]+2)d[i+3]*=clamp((spread-14)/10,0,1);}gc.putImageData(pixels,0,0);im=layer;}assets['girl-pickup']=im;meta['girl-pickup']={...p,fixedScale:true};}if(actor.sheets){await Promise.all(Object.entries(actor.sheets).map(async([name,sheet])=>{assets[name]=actorSurface(await image(`${folder}/${sheet.image}`),sheet);meta[name]=sheet;}));}if(actor.coupleImage){assets.couple=actorSurface(await image(`${folder}/${actor.coupleImage}`),actor.couple);meta.couple=actor.couple;}return actor;}
const ready=Promise.all([
 Promise.all(['props','challenges'].map(async n=>assets[n]=await image(`assets/${n}.webp`))),
 get('assets/sprites.json').then(m=>{Object.assign(meta,m);}),
 loadActor(C.girlFolder||'characters/girl','girl-walk'),loadActor(C.boyFolder||'characters/boy','gentleman'),
 get(`${C.backgroundFolder||'backgrounds'}/backgrounds.json`).then(async b=>{segmentWidth=b.segmentWidth||3000;overlap=b.overlap??200;backgrounds=b.panoramas;if(b.petals){meta.petals=b.petals;assets.petals=await image(`${C.backgroundFolder||'backgrounds'}/${b.petals.image}`);}await Promise.all(backgrounds.map(async (entry,i)=>{assets[`garden-${i+1}`]=await image(`${C.backgroundFolder||'backgrounds'}/${entry.file}`);}));WORLD=backgrounds.length*segmentWidth-(backgrounds.length-1)*overlap;END=WORLD-650;}),
 Promise.all(C.letters.map(letter)).then(ls=>letters=ls)
]).then(()=>{letters.forEach((l,i)=>l.x=1300+i*(END-2200)/Math.max(1,letters.length-1));END=Math.min(END,letters.at(-1).x+4*210*(meta['girl-walk'].cycleSeconds||.96)/2);loaded=true;return true;}).catch(e=>{loadError=e;console.error(e);return false;});
$('recipient').textContent=C.recipientName;document.title=C.title;$('birthday-title').textContent=C.finale.birthdayTitle;$('birthday-line').textContent=C.finale.birthdayLine;
$('yes').onclick=()=>{$('greeting').hidden=true;$('secret').hidden=false;$('answer').focus();};$('no').onclick=()=>{$('no-message').textContent='This little world is waiting for someone special. ♡';};$('back').onclick=()=>{$('secret').hidden=true;$('greeting').hidden=false;$('yes').focus();};
$('secret').onsubmit=async e=>{e.preventDefault();if(norm($('answer').value)!==norm(C.secretAnswer)){$('answer-message').textContent='Try that little name he calls you. ♡';$('answer').setAttribute('aria-invalid','true');return;}$('answer').removeAttribute('aria-invalid');$('enter').disabled=true;$('answer-message').textContent='Gathering moonlight…';play(bg);if(!await ready){bg.pause();$('answer-message').textContent=location.protocol==='file:'?'Upload the extracted website to GitHub Pages to open the letter folders.':'Something could not load. Check all uploaded folders, then refresh.';$('enter').disabled=false;return;}active=true;$('entrance').hidden=true;$('hud').hidden=false;updateCount();updateSound();setPhase('explore');camera=clamp(x-V*.3,0,WORLD-V);soundSync();showJourneyHelp();};
function positionJourneyPointer(){const r=$('joystick').getBoundingClientRect();$('joystick-pointer').style.left=(r.left+r.width/2)+'px';$('joystick-pointer').style.top=(r.top-83)+'px';}
function showJourneyHelp(){stop();$('journey-help').showModal();positionJourneyPointer();$('help-start').focus();updateAction();}
$('help-start').onclick=()=>{$('journey-help').close();};
$('journey-help').addEventListener('close',()=>{stop();updateAction();$('right').focus({preventScroll:true});if(active&&!carrying&&flowerIntro.state==='idle')beginFlowerIntro();});
window.addEventListener('resize',()=>{if($('journey-help').open)positionJourneyPointer();});
window.visualViewport?.addEventListener('resize',()=>{if($('journey-help').open)positionJourneyPointer();});
function updateCount(){$('letter-count').textContent=`${collected.size}/${letters.length}`;$('journal-button').setAttribute('aria-label',`Your letters: ${collected.size} of ${letters.length} collected`);}
function updateSound(){$('sound').textContent=muted?'♪̸':'♫';$('sound').setAttribute('aria-label',muted?'Play music':'Mute music');$('sound').setAttribute('aria-pressed',String(muted));}
$('sound').onclick=()=>{muted=!muted;updateSound();soundSync();};
function stop(){input=0;velocity=0;keys.clear();pointer=null;$('stick').style.transform='';}
function blocked(){return $('journey-help').open||$('love-question').open||manualPause||document.hidden||$('letter').open||$('journal').open||$('challenge').open;}
function setPhase(p){
 if(phase==='video'&&p!=='video')finaleVideo.pause();
 phase=p;clock=0;stop();$('end-reminder').hidden=true;cutHeld=false;$('cake-cutting').hidden=p!=='cutCake';if(p!=='loveQuestion'&&$('love-question').open)$('love-question').close();$('controls').hidden=p!=='explore';$('action').hidden=true;$('speech').hidden=true;
 $('ending').hidden=p!=='finished';$('video-screen').hidden=p!=='video';$('hud').hidden=!active||p==='video';
 updateAction();
}
async function playFinaleVideo(){
 $('video-play').hidden=true;$('video-status').textContent='';
 try{await finaleVideo.play();}catch(e){
  if(phase!=='video')return;
  $('video-play').hidden=false;
  $('video-status').textContent=e.name==='NotAllowedError'?'Tap play to watch your surprise. ♡':'The video could not play. You can try again or continue.';
 }
}
function startFinaleVideo(){
 setPhase('video');sparks=[];rockets=[];blooms=[];soundSync();
 finaleVideo.muted=muted;finaleVideo.src=C.finale.video||'video/1.mp4';finaleVideo.load();
 $('video-play').textContent='Play video ♡';playFinaleVideo();
}

let loveNoCount=0,cutHeld=false,cutProgress=0,cutFinishTime=0;
function askLove(){setPhase('loveQuestion');loveNoCount=0;$('love-plea').textContent='';$('love-question').showModal();$('love-yes').focus();}
$('love-no').onclick=()=>{if(phase!=='loveQuestion')return;loveNoCount++;$('love-plea').textContent='please '.repeat(loveNoCount)+'say yes ♡';};
$('love-yes').onclick=()=>{if(phase!=='loveQuestion')return;$('love-question').close();setPhase('kiss');$('live').textContent='He holds her close, and they share a gentle kiss.';};
$('love-question').addEventListener('cancel',e=>e.preventDefault());
function beginCakeCut(){cutProgress=0;cutFinishTime=0;setPhase('cutCake');$('cake-cutting').classList.remove('sliced');$('cake-art').style.setProperty('--cut',0);$('cut-progress').value=0;$('cut-button').disabled=false;$('cut-status').textContent='Hold the button to cut your birthday cake.';$('cut-button').focus();}
function endCut(){cutHeld=false;}
const cutButton=$('cut-button');
cutButton.addEventListener('pointerdown',e=>{if(e.button!==0||phase!=='cutCake'||blocked()||cutProgress>=1)return;e.preventDefault();cutButton.focus();cutButton.setPointerCapture(e.pointerId);cutHeld=true;});
for(const name of ['pointerup','pointercancel','lostpointercapture','blur'])cutButton.addEventListener(name,endCut);
cutButton.addEventListener('keydown',e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();if(phase==='cutCake'&&!blocked()&&cutProgress<1)cutHeld=true;}});
cutButton.addEventListener('keyup',e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();endCut();}});
window.addEventListener('blur',endCut);document.addEventListener('visibilitychange',endCut);$('pause').addEventListener('click',endCut);$('journal-button').addEventListener('click',endCut);
function tickCakeCut(dt){
 if(cutProgress<1){if(cutHeld)cutProgress=Math.min(1,cutProgress+dt/3);$('cake-art').style.setProperty('--cut',cutProgress);$('cut-progress').value=cutProgress;
 if(cutProgress>=1){endCut();$('cake-cutting').classList.add('sliced');$('cut-button').disabled=true;$('cut-status').textContent='A little slice of happiness, just for you. ♡';chime('win');}}
 else {cutFinishTime+=dt;if(cutFinishTime>=1.8)setPhase('tilt');}
}

function finishFinaleVideo(){if(phase!=='video')return;completed=true;setPhase('finished');$('ending-journal').focus();}
$('video-play').onclick=playFinaleVideo;
$('video-continue').onclick=finishFinaleVideo;
finaleVideo.addEventListener('ended',finishFinaleVideo);
finaleVideo.addEventListener('error',()=>{if(phase!=='video')return;$('video-status').textContent='The video could not load. You can try again or continue.';$('video-play').hidden=false;});
function updateAction(){let text=null;if(phase==='explore'&&near==='bouquet')text='Accept his flowers ♡';if(phase==='offer')text=C.finale.handButton;if(phase==='cake')text=C.finale.candleButton;$('action').hidden=!text||blocked();if(text)$('action').textContent=text;$('action').classList.toggle('cinematic',phase!=='explore');}
function findNear(){near=null;if(!carrying&&flowerIntro.state==='waiting'&&Math.abs(x-(BOUQUET-75))<50)near='bouquet';else{let d=140;letters.forEach((l,i)=>{if(Math.abs(x-l.x)<d){near=i;d=Math.abs(x-l.x);}});}updateAction();}
$('action').onclick=()=>{if(blocked())return;if(phase==='explore'&&near==='bouquet'){acceptIntroFlowers();}else if(phase==='explore'&&Number.isInteger(near)){requestLetter(near);}else if(phase==='offer'){setPhase('hold');chime('win');for(let i=0;i<160*density;i++)petals.push(makePetal(true));}else if(phase==='cake'){setPhase('blow');chime('wind');wind=1;}};
function requestLetter(i){if(phase!=='explore'||blocked()||!carrying)return;beginPickup(i);}
function beginPickup(target){
 if(phase!=='explore'||blocked())return;
 const itemX=target==='bouquet'?BOUQUET:letters[target].x;
 const direction=itemX>=x?1:-1;
 pickup={target,itemX,from:x,to:clamp(itemX-direction*45,START,END),direction,taken:false};
 face=direction;setPhase('pickup');
}
function tickPickup(){
 const p=pickup;if(!p){setPhase('explore');return;}
 const duration=meta['girl-pickup']?.duration||2.3;
 const oldX=x;x=mix(p.from,p.to,ease(clock/.35));gait+=Math.abs(x-oldX)/210;
 camera=mix(camera,clamp(x-V*.32,0,WORLD-V),.08);
 if(clock>=duration*.55&&!p.taken){p.taken=true;chime('tap');burst(p.itemX-camera,BASE-25,12,'hearts');}
 if(clock>=duration){const target=p.target;if(target==='bouquet')carrying=true;pickup=null;setPhase('explore');findNear();if(target!=='bouquet'){if(passed.has(target)||letters[target].challengeEnabled===false)openLetter(target);else startChallenge(target);}}
}
function pickupPose(){
 const duration=meta['girl-pickup']?.duration||2.3,t=clamp((clock-.35)/(duration-.35),0,1);
 const bend=t<.45?ease(t/.45):t<.6?1:1-ease((t-.6)/.4);
 return Math.round(bend*7);
}
function openLetter(i){stop();modalLetter={...letters[i],i};const l=modalLetter;collected.add(i);passed.add(i);$('letter-number').textContent=`${String(i+1).padStart(2,'0')} / ${letters.length} · FOR ${C.nickname.toUpperCase()}`;$('letter-title').textContent=l.title;$('message').textContent=l.message.replaceAll('{{nickname}}',C.nickname).replaceAll('{{name}}',C.recipientName).replaceAll('{{sender}}',C.senderName);$('signature').textContent=l.signature||`With love, ${C.senderName}`;$('photo').hidden=!l.picture;if(l.picture){$('photo-img').src=l.picture;$('photo-img').alt=l.imageAlt||'Our little memory';}$('caption').textContent=l.caption||'';$('letter-animation').hidden=!l.animation.file;if(l.animation.file)$('letter-animation').src=`${l.folder}/${l.animation.file}`;$('continue').textContent=i===letters.length-1?'A little further… ♡':'Keep it in my heart ♡';$('letter').showModal();$('letter').scrollTop=0;window.writeBirthdayLetter?.($('message').textContent,i);if(l.music){song.src=l.music;song.load();}soundSync();updateCount();updateAction();}
function closeLetter(){$('letter').close();}$('close-letter').onclick=closeLetter;$('continue').onclick=closeLetter;$('letter').addEventListener('close',()=>{if($('letter').open)return;modalLetter=null;soundSync();updateAction();});$('photo-img').onerror=()=>{$('photo').hidden=true;};$('letter-animation').onerror=()=>{$('letter-animation').hidden=true;};song.onerror=()=>{if(modalLetter){modalLetter.music=null;soundSync();}};
function showJournal(){stop();$('journal-title').textContent=`${letters.length} little letters`;$('journal-list').replaceChildren();letters.forEach((l,i)=>{const b=document.createElement('button');b.disabled=!collected.has(i);b.textContent=collected.has(i)?`♡  ${l.title}`:`✧  Letter ${i+1}`;b.onclick=()=>{$('journal').close();openLetter(i);};$('journal-list').append(b);});$('reset-confirm').hidden=true;$('journal').showModal();updateAction();}
$('journal-button').onclick=showJournal;$('ending-journal').onclick=showJournal;$('close-journal').onclick=()=>$('journal').close();$('journal').addEventListener('close',updateAction);$('restart').onclick=()=>{$('reset-confirm').hidden=false;};$('reset-no').onclick=()=>{$('reset-confirm').hidden=true;};$('reset-yes').onclick=()=>{collected.clear();passed.clear();carrying=false;completed=false;x=START;camera=0;bg.src=C.backgroundMusic;bg.load();$('journal').close();setPhase('explore');updateCount();soundSync();beginFlowerIntro();};$('replay').onclick=()=>{completed=false;beginCinema();};
function togglePause(){manualPause=!manualPause;$('pause-screen').hidden=!manualPause;$('pause').setAttribute('aria-pressed',String(manualPause));$('pause').setAttribute('aria-label',manualPause?'Continue adventure':'Pause adventure');stop();soundSync();updateAction();}$('pause').onclick=togglePause;$('resume').onclick=togglePause;
function setInput(n){input=n;$('stick').style.transform=`translateX(${n*22}px)`;}
function touchMove(e){if(e.pointerId!==pointer)return;const r=$('joystick').getBoundingClientRect(),dx=e.clientX-r.left-r.width/2;setInput(Math.abs(dx)<7?0:Math.sign(dx));}
$('joystick').addEventListener('pointerdown',e=>{if(phase!=='explore'||blocked())return;pointer=e.pointerId;$('joystick').setPointerCapture(pointer);touchMove(e);e.preventDefault();});$('joystick').addEventListener('pointermove',touchMove);['pointerup','pointercancel','lostpointercapture'].forEach(n=>$('joystick').addEventListener(n,stop));
window.addEventListener('keydown',e=>{if(!active||blocked())return;if(phase==='explore'&&['arrowright','arrowleft','a','d'].includes(e.key.toLowerCase())){e.preventDefault();keys.add(e.key.toLowerCase());setInput((keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0));}if(e.key.toLowerCase()==='e'){if(phase==='explore'&&Number.isInteger(near))requestLetter(near);else if(!$('action').hidden)$('action').click();}});window.addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase());if(pointer===null)setInput((keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0));});['left','right'].forEach((id,i)=>{$(id).addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();setInput(i?1:-1);}});$(id).addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')stop();});});window.addEventListener('blur',()=>{stop();});document.addEventListener('visibilitychange',()=>{stop();soundSync();});
function beginFlowerIntro(){flowerIntro={state:'arriving',boy:camera+V+160,start:camera+V+160,from:x};setPhase('flowerArrival');$('live').textContent='He arrives with roses, dressed in black.';}
function acceptIntroFlowers(){if(flowerIntro.state!=='waiting'||blocked())return;flowerIntro.from=x;flowerIntro.state='giving';setPhase('flowerAccept');}
function tickFlowerIntro(dt){
 if(phase==='flowerArrival'){flowerIntro.boy=mix(flowerIntro.start,BOUQUET+45,stroll(clock/3.8));if(clock>=3.8)setPhase('flowerKneel');}
 else if(phase==='flowerKneel'){if(clock>=1.6){flowerIntro.state='waiting';setPhase('explore');toast('Come closer, my precious girl. These roses are for you. ♡');}}
 else if(phase==='flowerAccept'){const old=x;x=mix(flowerIntro.from,BOUQUET-75,ease(clock/.5));gait+=Math.abs(x-old)/210;if(clock>=4.8){carrying=true;flowerIntro.state='farewell';setPhase('flowerFarewell');chime('win');}}
 else if(phase==='flowerFarewell'&&clock>=1.3){flowerIntro.state='done';setPhase('explore');toast('Keep these roses close. Your letter journey begins now. ♡');}
}
function drawFlowerIntro(now){
 if(phase==='flowerArrival'||phase==='flowerKneel'){drawGirl(x-camera,false,now);const frame=phase==='flowerArrival'?Math.floor(clock*6)%8:Math.min(11,8+Math.floor(clock/1.6*4));sprite('intro-boy',frame,flowerIntro.boy-camera,BASE,260,true);return;}
 if(phase==='flowerAccept'&&clock<.5){drawGirl(x-camera,true,now);sprite('intro-boy',11,flowerIntro.boy-camera,BASE,260,true);return;}
 const center=(BOUQUET-75+flowerIntro.boy)/2-camera;
 if(phase==='flowerAccept')sprite('intro-giving',Math.min(7,Math.floor((clock-.5)/4.3*8)),center,BASE,260);
 else{const fade=ease(clock/1.3);sprite('intro-giving',7,center,BASE,260,false,0,1-fade);ctx.save();ctx.globalAlpha=fade;drawGirl(x-camera,false,now);ctx.restore();}
}
function strollDuration(a,b){return Math.max(2.8,Math.abs(b-a)/(C.boyWalkSpeed||135));}
function stroll(t){t=clamp(t,0,1);const r=.15;if(t<r)return t*t/(2*r*(1-r));if(t>1-r)return 1-(1-t)*(1-t)/(2*r*(1-r));return (t-r/2)/(1-r);}
function beginCinema(){if(collected.size!==letters.length)return;stop();x=END;camera=clamp(END-V*.24,0,WORLD-V);cinematic={girl:x-camera,boy:V+180,startGirl:x-camera,boyStart:V+180,boyGait:0};setPhase('arrival');$('live').textContent='A boy approaches through the blossoms.';}
function tick(dt){if(blocked())return;const previousBoy=cinematic.boy,previousPhase=phase;clock+=dt;total+=dt;wind=Math.max(0,wind-dt*.38);
 if(phase.startsWith('flower')){tickFlowerIntro(dt);}
 else if(phase==='explore'){
  velocity=mix(velocity,input*210,Math.min(1,dt*10));if(Math.abs(velocity)<1)velocity=0;
  const limit=!carrying?BOUQUET-75:END;
  x=clamp(x+velocity*dt,START,limit);if(input)face=input;if(velocity)gait+=dt*Math.abs(velocity)/210;
  camera=mix(camera,clamp(x-V*.32,0,WORLD-V),1-Math.exp(-dt*5));findNear();
  const missingAtEnd=x>=END-2&&collected.size<letters.length;$('end-reminder').hidden=!missingAtEnd;
  if(x>=END-2&&collected.size===letters.length)beginCinema();
 }else if(phase==='pickup'){tickPickup();}
 else if(phase==='arrival'){const duration=strollDuration(V+180,V*.72);cinematic.boy=mix(V+180,V*.72,stroll(clock/duration));if(clock>=duration+.2)setPhase('kneel');}
 else if(phase==='kneel'){if(clock>=1.5){cinematic.startGirl=cinematic.girl;setPhase('approach');}}
 else if(phase==='approach'){const duration=Math.max(.85,Math.abs(cinematic.boy-148-cinematic.startGirl)/115),old=cinematic.girl;cinematic.girl=mix(cinematic.startGirl,cinematic.boy-148,stroll(clock/duration));gait+=Math.abs(cinematic.girl-old)/210;if(clock>=duration+.1){setPhase('offer');$('live').textContent='He offers his hand.';}}
 else if(phase==='hold'){if(clock>=3.2){setPhase('handKiss');$('live').textContent='He gently lifts her hand and kisses it.'}}
 else if(phase==='handKiss'){if(clock>=6.4)setPhase('danceRise');}
 else if(phase==='danceRise'){if(clock>=1.6){setPhase('dance');$('live').textContent="Together, they dance beneath the Moon's sakura tree.";}}
 else if(phase==='dance'){if(clock>=danceSettings().duration){setPhase('embrace');chime('heart');}}
 else if(phase==='embrace'){if(clock>=1.8){askLove();}}
 else if(phase==='kiss'){if(clock>=3.6)setPhase('release');}
 else if(phase==='release'){if(clock>=3.2)setPhase('wait');}
 else if(phase==='wait'){$('speech').hidden=false;$('speech').textContent=C.finale.waitLine;$('speech').style.left=`${cinematic.boy/V*100}%`;$('speech').style.top='57%';if(clock>=1.8){cinematic.boyStart=cinematic.boy;setPhase('walkAway');}}
 else if(phase==='walkAway'){const duration=strollDuration(cinematic.boyStart,V+180);cinematic.boy=mix(cinematic.boyStart,V+180,stroll(clock/duration));if(clock>=duration+.1)setPhase('fetch');}
 else if(phase==='fetch'){if(clock>=.65)setPhase('return');}
 else if(phase==='return'){const duration=strollDuration(V+180,cinematic.girl+180);cinematic.boy=mix(V+180,cinematic.girl+180,stroll(clock/duration));if(clock>=duration+.2){setPhase('cakeReveal');bg.src=C.finaleMusic;bg.load();soundSync();chime('win');}}
 else if(phase==='cakeReveal'){if(clock>=1.7){setPhase('cake');$('live').textContent='Make a wish, then blow out the candle.';}}
 else if(phase==='blow'){if(clock>=2.5)beginCakeCut();}
 else if(phase==='cutCake'){tickCakeCut(dt);}
 else if(phase==='tilt'){if(clock>=3.8)startFinaleVideo();}
 if(['arrival','walkAway','return'].includes(previousPhase))cinematic.boyGait=(cinematic.boyGait||0)+Math.abs(cinematic.boy-previousBoy)/(meta['boy-walk']?.strideDistance||130);

}
function makePetal(rain=false){const z=Math.random();return {x:Math.random()*V,y:rain?-Math.random()*700:Math.random()*1000,z,r:z>.84?19+Math.random()*16:z>.45?9+Math.random()*8:3+Math.random()*5,rotation:Math.random()*6.28,turn:Math.random()*6.28,speed:(rain?90:20)+z*(rain?130:55),rain,phase:Math.random()*6.28,variant:Math.floor(Math.random()*6)};}
function moonGardenAt(worldX){return worldX>=6*(segmentWidth-overlap)+overlap;}
const atmosphereNames=['rain','stars','crystals','hearts','snow','moondust','sakura'];
function atmosphereState(worldX=x){
 const stride=segmentWidth-overlap,section=clamp(Math.floor((worldX-overlap)/stride),0,6);
 const blend=section===0?1:ease((worldX-(section*stride+overlap))/180);
 return {section,previous:Math.max(0,section-1),blend};
}
function paintAtmosphere(p,now,section,opacity){
 if(opacity<=0)return;ctx.save();ctx.translate(p.x,p.y);ctx.globalAlpha=opacity*(.35+p.z*.5);const r=Math.max(2,p.r*.48);
 const colors=['#bdeaff','#fff0bd','#bdf9ed','#ffc4dd','#f2f7ff','#e8d8ff','#ffcddd'];ctx.fillStyle=ctx.strokeStyle=colors[section];ctx.lineWidth=1.2;
 if(section===0){ // Fine luminous rain, angled slightly by the breeze.
  ctx.globalAlpha*=.65;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-3-p.z*3,12+p.z*20);ctx.stroke();
 }else if(section===1){ // Five-point falling stars with delicate tails.
  ctx.globalAlpha*=.8+.2*Math.sin(now*2+p.phase);ctx.beginPath();ctx.moveTo(-r*1.8,-r*2.5);ctx.lineTo(0,0);ctx.stroke();ctx.rotate(p.rotation*.25);ctx.beginPath();for(let j=0;j<10;j++){const a=j*Math.PI/5-Math.PI/2,rr=j%2?r*.42:r;j?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();
 }else if(section===2){ // Faceted mint and lavender crystal flakes.
  ctx.rotate(p.rotation);ctx.beginPath();ctx.moveTo(0,-r*1.5);ctx.lineTo(r*.6,0);ctx.lineTo(0,r*1.5);ctx.lineTo(-r*.6,0);ctx.closePath();ctx.fill();ctx.strokeStyle='#ffffff';ctx.globalAlpha*=.7;ctx.beginPath();ctx.moveTo(0,-r*1.5);ctx.lineTo(0,r*1.5);ctx.stroke();
 }else if(section===3){ // Soft rose hearts drifting through the nebula.
  ctx.rotate(Math.sin(now*.8+p.phase)*.35);ctx.beginPath();ctx.moveTo(0,r*.8);ctx.bezierCurveTo(-r*1.8,-r*.25,-r*.8,-r*1.4,0,-r*.45);ctx.bezierCurveTo(r*.8,-r*1.4,r*1.8,-r*.25,0,r*.8);ctx.fill();
 }else if(section===4){ // Six-armed snowflakes, with smaller soft snow grains.
  ctx.rotate(p.rotation*.3);if(p.z<.35){ctx.beginPath();ctx.arc(0,0,1.6+p.z*2,0,Math.PI*2);ctx.fill();}else{for(let j=0;j<6;j++){ctx.save();ctx.rotate(j*Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-r);ctx.moveTo(-r*.28,-r*.65);ctx.lineTo(0,-r*.42);ctx.lineTo(r*.28,-r*.65);ctx.stroke();ctx.restore();}}
 }else if(section===5){ // Pearly lunar motes: glowing round dust and tiny crescents.
  ctx.globalAlpha*=.6+.4*Math.sin(now+p.phase)**2;if(p.variant%3===0){ctx.rotate(p.rotation*.2);ctx.beginPath();ctx.arc(0,0,r,-Math.PI/2,Math.PI/2);ctx.quadraticCurveTo(-r*.1,0,0,-r);ctx.fill();}else{const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'#fffbea');g.addColorStop(.3,'#e9dcffa0');g.addColorStop(1,'#ddd0ff00');ctx.fillStyle=g;ctx.fillRect(-r,-r,r*2,r*2);}
 }else{
  ctx.rotate(p.rotation);ctx.scale(1,reduce?1:.28+Math.abs(Math.cos(now*.8+p.turn))*.72);if(assets.petals)prop(p.variant,0,0,p.r*2,0,opacity*(.4+p.z*.4),'petals');else{ctx.beginPath();ctx.ellipse(0,0,p.r,p.r*.45,0,0,Math.PI*2);ctx.fill();}
 }ctx.restore();
}
function paintPetal(p,now){const a=atmosphereState();paintAtmosphere(p,now,a.previous,1-a.blend);paintAtmosphere(p,now,a.section,a.blend);}
function moveAtmosphere(p,dt,now,deltaCamera){
 if(reduce)return;const a=atmosphereState(),fall=[4.5,1.25,.85,.65,.7,.4,1],sway=[5,10,20,35,28,18,35];
 const speed=mix(fall[a.previous],fall[a.section],a.blend),drift=mix(sway[a.previous],sway[a.section],a.blend);
 p.y+=p.speed*speed*dt;p.x+=(8+Math.sin(now*.8+p.phase)*drift+wind*260)*dt-deltaCamera*(.08+p.z*.3);p.rotation+=dt*(.4+p.z);
 if(p.y>1030){if(p.rain){p.dead=true;return;}p.y=-35;p.x=Math.random()*V;}if(p.x>V+45)p.x=-35;if(p.x< -60)p.x=V+30;
}
function resize(){W=$('app').clientWidth;H=$('app').clientHeight;S=H/1000;V=W/S;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr*S,0,0,dpr*S,0,0);petals=Array.from({length:Math.round(140*density)},()=>makePetal());stars=Array.from({length:90},()=>({x:Math.random(),y:Math.random()*.75,r:.5+Math.random()*1.6,p:Math.random()*6.28}));if(active&&phase!=='explore'&&phase!=='pickup'&&!['video','finished'].includes(phase)){cinematic.girl=V*.72-148;cinematic.boy=V*.72;}if(active)camera=clamp(x-V*.32,0,WORLD-V);}
window.addEventListener('resize',resize);
function fitDialogs(){const viewport=window.visualViewport;$('app').style.setProperty('--visible-height',`${viewport?.height||H}px`);$('app').style.setProperty('--dialog-top',`${(viewport?.offsetTop||0)+(viewport?.height||H)/2}px`);}
window.visualViewport?.addEventListener('resize',fitDialogs);window.visualViewport?.addEventListener('scroll',fitDialogs);window.addEventListener('resize',fitDialogs);

function glow(px,py,r,color){const g=ctx.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(px-r,py-r,r*2,r*2);}
function sprite(name,frame,px,py,height,flip=false,rotation=0,alpha=1){
 const im=assets[name],m=meta[name];if(!im||!m)return null;const f=m.frames[clamp(frame,0,m.frames.length-1)];
 const scale=m.fixedScale?height/(f.referenceHeight||m.referenceHeight):height/f.h,w=f.w*scale,h=f.h*scale;
 const dx=m.fixedScale?(f.x-f.anchorX)*scale:-w/2,dy=m.fixedScale?(f.y-f.anchorY)*scale:-h;
 ctx.save();ctx.globalAlpha*=alpha;ctx.translate(px,py);if(flip)ctx.scale(-1,1);ctx.rotate(rotation);ctx.drawImage(im,f.x,f.y,f.w,f.h,dx,dy,w,h);ctx.restore();return {w,h};
}
function walkFrame(name,time){const a=meta[name],sequence=a.walkFrames||[0,1,2,3];return sequence[Math.floor(time/(a.cycleSeconds||1)*sequence.length)%sequence.length];}
function prop(index,px,py,size,rotation=0,alpha=1,name='props'){const im=assets[name],m=meta[name];if(!im||!m)return;const f=m.frames[index],ratio=f.w/f.h,w=ratio>1?size:size*ratio,h=ratio>1?size/ratio:size;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(px,py);ctx.rotate(rotation);ctx.drawImage(im,f.x,f.y,f.w,f.h,-w/2,-h/2,w,h);ctx.restore();}
function drawGirl(px,walking,now){
 const a=meta['girl-walk'];if(!a)return;
 const picking=phase==='pickup'&&pickup;
 const hasBouquet=carrying||!!(picking&&pickup.target==='bouquet'&&pickup.taken);
 const pickupSheet=hasBouquet?'girl-bouquet-pickup':'girl-pickup',pm=meta[pickupSheet];
 const pose=picking?pickupPose():0,usePickup=picking&&clock>=.35&&pm;
 if(picking&&clock<.35)walking=true;
 const moving=walking&&!reduce;
 const sheet=usePickup?pickupSheet:hasBouquet?(moving?'girl-bouquet-walk':'girl-bouquet-pickup'):'girl-walk';
 const frame=usePickup?pose:moving?walkFrame(sheet,gait):0;
 const bob=reduce||walking||picking?0:Math.sin(now*2)*.65;
 glow(px,BASE+2,42,'#efb6d31b');
 // Blend only the short handover into the integrated bouquet pose.
 const handover=picking&&pickup.target==='bouquet'&&pickup.taken?ease((clock-2.3*.55)/.18):1;
 if(handover<1)sprite('girl-pickup',pose,px,BASE,245,face<0,0,1-handover);
 sprite(sheet,frame,px,BASE+bob,a.displayHeight||245,face<0,0,handover);
 if(picking){const p=pickup,index=p.target==='bouquet'?0:2,groundY=BASE-(index===0?36:25);
  if(!p.taken)prop(index,p.itemX-camera,groundY,index===0?90:55);
  else if(index===2){const f=pm.frames[pose],scale=(a.displayHeight||245)/pm.referenceHeight;
   const hx=px+(f.handX-f.anchorX)*scale*face,hy=BASE+(f.handY-f.anchorY)*scale,t=ease((clock-2.3*.55)/.2);
   prop(2,mix(p.itemX-camera,hx,t),mix(groundY,hy,t),48);
  }
 }
}
let dreamPointer=0;
window.addEventListener('pointermove',e=>{dreamPointer=clamp(e.clientX/Math.max(1,W)*2-1,-1,1);},{passive:true});
window.addEventListener('deviceorientation',e=>{if(Number.isFinite(e.gamma))dreamPointer=clamp(e.gamma/30,-1,1);},{passive:true});
function drawDreamPanorama(im,...a){
 if(a.length===4)a=[0,0,im.width,im.height,...a];const [sx,sy,sw,sh,dx,dy,dw,dh]=a;
 const drift=reduce?0:Math.sin(total*.22)*2+dreamPointer*4;
 ctx.save();ctx.beginPath();ctx.rect(-20,0,V+40,BASE);ctx.clip();ctx.transform(1,0,-drift/BASE,1,drift,0);ctx.drawImage(im,sx,sy,sw,sh,dx,dy,dw,dh);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(-20,BASE,V+40,1000-BASE);ctx.clip();ctx.drawImage(im,sx,sy,sw,sh,dx,dy,dw,dh);ctx.restore();
}
function drawWorld(now){
 const sky=ctx.createLinearGradient(0,0,0,1000);sky.addColorStop(0,'#040b20');sky.addColorStop(.65,'#142041');sky.addColorStop(1,'#261b38');ctx.fillStyle=sky;ctx.fillRect(0,0,V,1000);
 for(const s of stars){ctx.globalAlpha=.25+.5*(.5+.5*Math.sin(now*.8+s.p));ctx.fillStyle='#e7ddff';ctx.beginPath();ctx.arc(s.x*V,s.y*1000,s.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 const tilt=phase==='tilt'?ease(clock/3.8):['video','finished'].includes(phase)?1:0;
 ctx.save();applyRomanceCamera();ctx.translate(0,tilt*1100);
 const cam=phase==='entrance'?200+Math.sin(now*.07)*70:camera;
 for(let i=0;i<backgrounds.length;i++){const im=assets[`garden-${i+1}`];if(!im)continue;const dx=i*(segmentWidth-overlap)-cam;if(dx>V||dx+segmentWidth<0)continue;if(i===0)drawDreamPanorama(im,dx,0,segmentWidth,1000);else{
  const fade=overlap,steps=24,sw=im.width*fade/segmentWidth;
  for(let j=0;j<steps;j++){ctx.globalAlpha=(j+.5)/steps;drawDreamPanorama(im,j*sw/steps,0,sw/steps,im.height,dx+j*fade/steps,0,fade/steps+.2,1000);}
  ctx.globalAlpha=1;drawDreamPanorama(im,sw,0,im.width-sw,im.height,dx+fade,0,segmentWidth-fade,1000);
 }}
 // Subtle environmental motion: drifting light, water glints and low mist.
 ctx.globalCompositeOperation='screen';
 for(let i=0;i<23;i++){const px=((i*137+now*5)% (V+100))-50,py=570+i*8+Math.sin(now*.6+i)*3;ctx.globalAlpha=.02+.02*Math.sin(now+i);ctx.fillStyle='#bcdcff';ctx.fillRect(px,py,10+(i%5)*12,1);}
 for(let i=0;i<3;i++){const px=((now*(i+1)*8+i*V*.4)%(V+600))-300;glow(px,690+i*25,230,'#cbbced09');}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 for(const p of petals){if(p.z<.65)paintPetal(p,now);}
 if(active&&['explore','pickup'].includes(phase)){
  if(!carrying&&flowerIntro.state==='waiting')sprite('intro-boy',11,flowerIntro.boy-camera,BASE,260,true);
  letters.forEach((l,i)=>{if(phase==='pickup'&&pickup?.target===i)return;const px=l.x-camera;if(px< -100||px>V+100)return;const done=collected.has(i);glow(px,BASE-40,55,done?'#ffdca41c':'#ffbedf3d');prop(2,px,BASE-45+Math.sin(now*2+i)*5,done?52:68,Math.sin(now+i)*.07,done?.5:1);});
  if(collected.size<letters.length&&x>letters.at(-1).x-100){for(let i=0;i<25;i++){const py=500+i*14;glow(letters.at(-1).x+200-camera+Math.sin(now+i)*6,py,10,'#f2b9d554');}}
  drawGirl(x-camera,Math.abs(velocity)>5,now);
 }else if(active&&!['video','finished'].includes(phase))drawCinema(now);
 ctx.restore();
 // The moon is independent of the painted layers and stays visible in portrait.
 // Celestial bodies are painted into each scene; no duplicate Moon above the lunar garden.
 // Slow shooting stars; no full-screen flashes.
 if(!reduce){const q=(now%13)/2;if(q<1){ctx.strokeStyle=`rgba(226,225,255,${Math.sin(q*Math.PI)*.6})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(V*.12+q*V*.7,70+q*110);ctx.lineTo(V*.12+q*V*.7-45,70+q*110-12);ctx.stroke();}}
 if(phase==='entrance'){const shade=ctx.createLinearGradient(0,0,0,1000);shade.addColorStop(0,'#08102033');shade.addColorStop(1,'#07112755');ctx.fillStyle=shade;ctx.fillRect(0,0,V,1000);}
}
function romancePhase(p=phase){return ['hold','handKiss','danceRise','dance','embrace','loveQuestion','kiss','release'].includes(p);}
function danceSettings(){
 const frames=meta['couple-dance']?.frames.length||20;
 const fps=clamp(Number(C.finale.danceFPS)||8,2,30),cycles=clamp(Math.round(Number(C.finale.danceCycles)||20),1,100);
 return {frames,fps,cycles,duration:frames/fps*cycles};
}
function romanceCamera(){
 if(!romancePhase())return {strength:0,zoom:1};
 const entering=phase==='hold'?ease(clock/2):1;
 const leaving=phase==='release'?1-ease((clock-.6)/2.6):1;
 const strength=entering*leaving;
 // Keep both full silhouettes visible even in portrait while centering their faces.
 const wide=clamp(V*.86/285,1.12,2.15),tight=clamp(V*.86/240,1.12,2.6);
 if(phase==='handKiss'){const close=ease(clock/.65)*(1-ease((clock-5.7)/.7));return {strength,zoom:reduce?1.08:mix(Math.min(wide,1.4),1.5,close)};}
 const intimacy=phase==='embrace'?ease(clock/1.8):['loveQuestion','kiss','release'].includes(phase)?1:0;
 return {strength,zoom:mix(1,reduce?1.08:mix(wide,tight,intimacy),strength)};
}
function applyRomanceCamera(){
 const {strength,zoom}=romanceCamera();if(!strength)return;
 const center=(cinematic.girl+cinematic.boy)/2,focusY=BASE-140;
 ctx.translate(mix(center,V/2,strength),mix(focusY,610,strength));ctx.scale(zoom,zoom);ctx.translate(-center,-focusY);
}
function romancePose(){
 if(phase==='hold')return {sheet:'couple-rise',frame:0};
 if(phase==='handKiss')return {sheet:'couple-hand-kiss-hd',frame:0};
 if(phase==='danceRise')return {sheet:'couple-rise',frame:Math.min(3,Math.floor(clock/1.6*4))};
 if(phase==='dance'){const d=danceSettings();return {sheet:'couple-dance',frame:reduce?0:Math.floor(clock*d.fps)%d.frames};}
 if(phase==='embrace')return {sheet:'couple-embrace',frame:Math.min(2,Math.floor(clock/1.8*3))};
 if(phase==='loveQuestion')return {sheet:'couple-embrace',frame:2};
 if(phase==='kiss')return {sheet:'couple-embrace',frame:clock<1.8?3:4};
 return {sheet:'couple-embrace',frame:5};
}
function drawRomance(now){
 const center=(cinematic.girl+cinematic.boy)/2,{sheet,frame}=romancePose();
 const sway=reduce?0:phase==='dance'?0:Math.sin(clock*1.4)*.6;
 const release=phase==='release'?ease((clock-2.4)/.8):0;
 const entry=phase==='hold'?ease(clock/.4):1;
 const alpha=entry*(1-release);
 glow(center,BASE-130,165,'#ffc0da12');
 sprite(sheet,frame,center+sway,BASE,260,false,0,alpha);
 if(entry<1||release>0){ctx.save();ctx.globalAlpha=1-alpha;drawGirl(cinematic.girl,false,now);sprite('gentleman',phase==='hold'?2:0,cinematic.boy,BASE,260,true);ctx.restore();}
}
function drawCinema(now){
 if(phase.startsWith('flower')){drawFlowerIntro(now);return;}
 if(romancePhase()){drawRomance(now);return;}
 const travel=['arrival','walkAway','return'].includes(phase),cakeVisible=['return','cakeReveal','cake','blow','cutCake','tilt'].includes(phase);
 let sheet='gentleman',boyFrame=0;const boyFlip=phase!=='walkAway';
 if(travel&&!reduce){sheet=phase==='return'?'boy-carry':'boy-walk';boyFrame=walkFrame(sheet,cinematic.boyGait||0);}
 else if(cakeVisible)boyFrame=3;
 else if(phase==='kneel')boyFrame=clock<.65?1:2;
 else if(['approach','offer'].includes(phase))boyFrame=2;
 face=1;drawGirl(cinematic.girl,phase==='approach',now);
 if(phase!=='fetch')sprite(sheet,boyFrame,cinematic.boy,BASE,meta.gentleman.displayHeight||260,boyFlip);
 // The cake, plate and supporting hands are one complete pose, never a floating prop.
 if(cakeVisible){
  const m=meta[sheet],f=m.frames[boyFrame],scale=(meta.gentleman.displayHeight||260)/m.referenceHeight;
  const cx=cinematic.boy+(f.candleX-f.anchorX)*scale*(boyFlip?-1:1),cy=BASE+(f.candleY-f.anchorY)*scale;
  const alpha=['cutCake','tilt'].includes(phase)?0:phase==='blow'?clamp(1-clock/1.1,0,1):1;
  drawFlame(cx,cy,4,alpha,now);
  if(phase==='cakeReveal'||phase==='cake')glow(cx,cy+15,38,'#ffcab518');
  if(phase==='blow'&&clock>.7)glow(cx+Math.sin(clock*4)*5,cy-clock*12,12,'#e1e5ff17');
 }
}
function drawFlame(px,py,size,alpha,now){if(alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;const sway=reduce?0:Math.sin(now*12)*2;glow(px+sway,py,size*4,'#ffb95637');ctx.fillStyle='#ffbc64';ctx.beginPath();ctx.ellipse(px+sway,py,size*.48,size*(1+.1*Math.sin(now*14)),sway*.04,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff5cb';ctx.beginPath();ctx.ellipse(px,py+size*.3,size*.23,size*.52,0,0,Math.PI*2);ctx.fill();ctx.restore();}
function burst(px,py,n,effect='hearts'){for(let i=0;i<n*density;i++)sparks.push({x:px,y:py,vx:(Math.random()-.5)*230,vy:(Math.random()-.8)*190,life:2+Math.random()*1.5,max:3.5,color:'#ffc6e4',symbol:effect==='stars'?'✦':effect==='petals'?'✿':'♡',size:8+Math.random()*10});}
function launch(){
 if(reduce){burst(V*(.2+Math.random()*.6),150+Math.random()*250,12,'stars');return;}
 fireworkBeat++;const type=['willow','heart','chrysanthemum','ring','willow'][fireworkBeat%5],count=fireworkBeat%5===0?5:fireworkBeat%3===0?3:2;
 for(let j=0;j<count;j++){const pos=count===1?.5:.12+j*(.76/(count-1));rockets.push({x:V*(.15+Math.random()*.7),y:1050,tx:V*pos,ty:120+Math.random()*260,t:-j*.1,hue:type==='willow'?42:(fireworkBeat*43+j*26)%360,type,launchDuration:1.25+Math.random()*.4});}
}
function detonate(r){
 const budget=Math.round((r.type==='willow'?155:120)*density),radius=clamp(V*.48,180,390),speed=radius*(r.type==='willow'?.6:.9);
 blooms.push({x:r.tx,y:r.ty,r:0,life:.8,color:`hsla(${r.hue},95%,80%,.18)`,radius});
 for(let i=0;i<budget;i++){const a=i/budget*Math.PI*2;let vx,vy;
  if(r.type==='heart'){vx=Math.pow(Math.sin(a),3)*speed;vy=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))/16*speed;}
  else{const v=speed*(r.type==='ring'?.95:.35+Math.random()*.7);vx=Math.cos(a)*v;vy=Math.sin(a)*v;}
  const life=r.type==='willow'?4.5+Math.random()*2.3:3+Math.random()*1.8;
  sparks.push({x:r.tx,y:r.ty,vx,vy,life,max:life,color:`hsl(${r.hue+Math.random()*18},95%,${r.type==='willow'?74:78}%)`,size:2+Math.random()*2.2,tail:[],willow:r.type==='willow'});
 }
}
function effects(dt,now){
 const deltaCamera=phase==='explore'?camera-lastEffectCamera:0;lastEffectCamera=camera;
 for(const p of petals){moveAtmosphere(p,dt,now,deltaCamera);if(p.z>=.65)paintPetal(p,now);}
 petals=petals.filter(p=>!p.dead);
 for(let i=0;i<18*density;i++){const px=(Math.sin(now*.1+i*13)*.5+.5)*V,py=450+(Math.sin(now*.23+i*3)*.5+.5)*440;glow(px,py,6,'#e4fca546');}
 ctx.save();ctx.globalCompositeOperation='lighter';
 for(const r of rockets){r.t+=dt/r.launchDuration;if(r.t<0||r.done)continue;const progress=1-Math.pow(1-clamp(r.t,0,1),1.6),px=mix(r.x,r.tx,progress),py=mix(r.y,r.ty,progress);ctx.strokeStyle=`hsla(${r.hue},100%,84%,.8)`;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-3,py+55);ctx.stroke();glow(px,py,10,`hsla(${r.hue},100%,80%,.5)`);if(r.t>=1){r.done=true;detonate(r);}}
 rockets=rockets.filter(r=>!r.done);
 blooms=blooms.filter(b=>b.life>0);for(const b of blooms){b.life-=dt;b.r+=dt*b.radius*2;ctx.globalAlpha=Math.max(0,b.life/.8);glow(b.x,b.y,Math.max(1,b.r),b.color);}
 sparks=sparks.filter(p=>p.life>0).slice(-Math.round(1800*density));
 for(const p of sparks){p.life-=dt;if(p.tail){p.tail.push([p.x,p.y]);if(p.tail.length>(p.willow?14:7))p.tail.shift();}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-(p.willow?.5:.7)*dt);p.vy+= (p.willow?32:22)*dt;
  const alpha=clamp(p.life/p.max,0,1);ctx.globalAlpha=alpha;ctx.fillStyle=p.color;
  if(p.symbol){ctx.font=`${p.size}px Georgia`;ctx.fillText(p.symbol,p.x,p.y);continue;}
  if(p.tail?.length>1){ctx.strokeStyle=p.color;ctx.lineWidth=p.willow?1.6:1.2;ctx.globalAlpha=alpha*.48;ctx.beginPath();p.tail.forEach(([tx,ty],i)=>{if(i===0)ctx.moveTo(tx,ty);else ctx.lineTo(tx,ty);});ctx.lineTo(p.x,p.y);ctx.stroke();}
  ctx.globalAlpha=alpha;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();ctx.globalAlpha=1;
}
const miniCanvas=$('mini-canvas'),mc=miniCanvas.getContext('2d');
function miniSize(){const dpr=Math.min(devicePixelRatio||1,2);miniCanvas.width=400*dpr;miniCanvas.height=357*dpr;mc.setTransform(dpr,0,0,dpr,0,0);}
function miniProp(index,px,py,size,rotation=0){const im=assets.challenges,f=meta.challenges.frames[index],ratio=f.w/f.h,w=size,h=size/ratio;mc.save();mc.translate(px,py);mc.rotate(rotation);mc.drawImage(im,f.x,f.y,f.w,f.h,-w/2,-h/2,w,h);mc.restore();}
function startChallenge(i){stop();const gate=letters[i].gate;mini={i,type:gate.type,t:0,taps:0,target:Math.floor(Math.random()*(Math.max(0,(gate.maxTaps||12)-(gate.minTaps||8))+1))+(gate.minTaps||8),caught:new Set(),step:0,matched:new Set(),flipped:[],flipAge:0,won:false,winAge:0,shake:0,particles:[]};$('challenge-number').textContent=`ADVENTURE ${i+1} / ${letters.length}`;$('challenge-title').textContent=gate.title||'A little secret';$('challenge-hint').textContent=gate.hint||'';$('challenge-status').textContent='';$('mini-buttons').replaceChildren();$('playfield').hidden=gate.type==='question';$('question-form').hidden=gate.type!=='question';miniSize();
 const make=(cls,label,fn)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.setAttribute('aria-label',label);b.onclick=fn;$('mini-buttons').append(b);return b;};
 if(gate.type==='treasure'){make('chest-hit','Tap the treasure chest',()=>{if(!mini||mini.won)return;mini.taps++;mini.shake=1;miniBurst(200,185);chime('tap');$('challenge-status').textContent=`${mini.taps} / ${mini.target}`;if(mini.taps>=mini.target)winChallenge();});}
 else if(gate.type==='rabbits'){mini.rabbits=Array.from({length:3},(_,j)=>({x:80+j*100,y:150+j*40,p:j*2.7,button:make('rabbit-hit',`Catch bunny ${j+1}`,()=>{if(!mini||mini.won||mini.caught.has(j))return;mini.caught.add(j);mini.rabbits[j].button.hidden=true;miniBurst(mini.rabbits[j].x,mini.rabbits[j].y);chime();$('challenge-status').textContent=`${mini.caught.size} / 3`;if(mini.caught.size===3)winChallenge();})}));}
 else if(gate.type==='constellation'){mini.points=[[90,100],[180,65],[310,120],[250,250],[115,255]];mini.points.forEach(([px,py],j)=>{const b=make('star-hit',`Star ${j+1}`,()=>{if(!mini||mini.won)return;if(j!==mini.step){$('challenge-status').textContent='Follow the glowing star. ♡';return;}mini.step++;miniBurst(px,py);chime();b.classList.add('done');b.textContent='♥';$('challenge-status').textContent=`${mini.step} / 5`;updateStars();if(mini.step===5)winChallenge();});b.style.left=`${px/4}%`;b.style.top=`${py/357*100}%`;b.textContent='✦';});updateStars();}
 else if(gate.type==='memory'){mini.cards=['♡','♡','✿','✿','☾','☾'];for(let j=mini.cards.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[mini.cards[j],mini.cards[k]]=[mini.cards[k],mini.cards[j]];}mini.cards.forEach((symbol,j)=>{const b=make('memory-card',`Reveal card ${j+1}`,()=>{if(!mini||mini.won||mini.flipped.length===2||mini.flipped.includes(j)||mini.matched.has(j))return;mini.flipped.push(j);b.classList.add('flipped');b.textContent=symbol;chime('tap');if(mini.flipped.length===2){const [a,c]=mini.flipped;if(mini.cards[a]===mini.cards[c]){mini.matched.add(a);mini.matched.add(c);mini.flipped=[];for(const n of [a,c])$('mini-buttons').children[n].classList.add('matched');$('challenge-status').textContent=`${mini.matched.size/2} / 3`;chime();if(mini.matched.size===6)winChallenge();}else mini.flipAge=0;}});b.style.left=`${7+(j%3)*30}%`;b.style.top=`${10+Math.floor(j/3)*45}%`;b.textContent='✧';});}
 else if(['melody','maze','timing'].includes(gate.type)){startExtraChallenge(make);}
 else if(gate.type==='question'){$('question-label').textContent=gate.question;$('question-answer').value='';$('question-answer').removeAttribute('aria-invalid');}
 else {$('challenge-status').textContent='This challenge needs a valid type in its folder.';}
 $('challenge').showModal();if(gate.type==='question')$('question-answer').focus();updateAction();
}
function startExtraChallenge(make){
 const place=(b,left,top,width,height)=>{Object.assign(b.style,{left:left+'%',top:top+'%',width:width+'%',height:height+'%'});return b;};
 if(mini.type==='melody'){
  mini.sequence=Array.from({length:3},()=>Math.floor(Math.random()*4));mini.sequenceAge=0;mini.sequenceStep=0;mini.showing=true;
  mini.pads=['♡','✿','☾','✦'].map((symbol,j)=>{const b=place(make('melody-pad',symbol,()=>{if(!mini||mini.won||mini.showing)return;if(j!==mini.sequence[mini.sequenceStep]){mini.sequenceAge=0;mini.sequenceStep=0;mini.showing=true;$('challenge-status').textContent='Try again — watch the pattern. ♡';return;}mini.sequenceStep++;chime('tap');$('challenge-status').textContent=mini.sequenceStep+' / 3';if(mini.sequenceStep===3)winChallenge();}),10+j%2*44,10+Math.floor(j/2)*34,36,27);b.textContent=symbol;return b;});
  const repeat=place(make('mini-text','Watch the pattern again',()=>{if(!mini||mini.won)return;mini.sequenceAge=0;mini.sequenceStep=0;mini.showing=true;}),18,82,64,14);repeat.textContent='Watch again';
  $('challenge-status').textContent='Watch the glowing symbols…';
 }else if(mini.type==='maze'){
  mini.position=0;mini.path=new Set([0,1,2,6,7,10,11,12,13,16,17,18,22,23,24]);
  mini.tiles=Array.from({length:25},(_,j)=>{const b=place(make('maze-tile','Tile '+(j+1),()=>{if(!mini||mini.won)return;const from=mini.position;if(Math.abs(Math.floor(from/5)-Math.floor(j/5))+Math.abs(from%5-j%5)!==1){$('challenge-status').textContent='Choose a tile next to your heart.';return;}mini.position=j;updateMaze();chime('tap');if(j===24)winChallenge();}),5+j%5*18,5+Math.floor(j/5)*18,16,16);b.disabled=!mini.path.has(j);return b;});updateMaze();
 }else{
  mini.hits=0;mini.lastCatch=-1;mini.marker=.5;
  const track=document.createElement('div');track.className='timing-track';const zone=document.createElement('span');zone.className='timing-zone';mini.pointer=document.createElement('span');mini.pointer.className='timing-pointer';mini.pointer.textContent='♥';track.append(zone,mini.pointer);$('mini-buttons').append(track);
  const b=place(make('mini-text','Catch the heart in the pink zone',()=>{if(!mini||mini.won||mini.t-mini.lastCatch<.4)return;mini.lastCatch=mini.t;if(mini.marker>=.34&&mini.marker<=.66){mini.hits++;chime('tap');$('challenge-status').textContent=mini.hits+' / 3';if(mini.hits===3)winChallenge();}else $('challenge-status').textContent='A little closer to the middle. Try again. ♡';}),20,64,60,20);b.textContent='Catch ♡';
 }
}
function updateMaze(){mini.tiles.forEach((b,j)=>{b.textContent=j===mini.position?'♥':j===24?'✿':mini.path.has(j)?'·':'';b.classList.toggle('current',j===mini.position);b.setAttribute('aria-label',j===mini.position?'Your heart':j===24?'Flower goal':mini.path.has(j)?'Path tile '+(j+1):'Wall');});}
function tickExtraChallenge(dt){
 if(mini.won)return;
 if(mini.type==='melody'){
  if(mini.showing){mini.sequenceAge+=dt;const index=Math.floor((mini.sequenceAge-.6)/.85),lit=index>=0&&index<3&&((mini.sequenceAge-.6)%.85)<.6?mini.sequence[index]:-1;mini.pads.forEach((b,j)=>{b.classList.toggle('lit',j===lit);b.disabled=true;});if(mini.sequenceAge>=3.2){mini.showing=false;mini.pads.forEach(b=>{b.disabled=false;b.classList.remove('lit');});$('challenge-status').textContent='Your turn — repeat the three symbols.';}}
 }else if(mini.type==='timing'){mini.marker=reduce?.5:.5+Math.sin(mini.t*1.8)*.46;mini.pointer.style.left=mini.marker*100+'%';}
}
function updateStars(){if(!mini)return;[...$('mini-buttons').children].forEach((b,j)=>b.classList.toggle('next',j===mini.step));}
function miniBurst(px,py){for(let j=0;j<20*density;j++)mini.particles.push({x:px,y:py,vx:(Math.random()-.5)*160,vy:(Math.random()-.5)*150,life:1.2});}
function winChallenge(){if(!mini||mini.won)return;mini.won=true;mini.winAge=0;passed.add(mini.i);$('challenge-status').textContent='This little letter is yours. ♡';chime('win');miniBurst(200,180);}
$('question-form').onsubmit=e=>{e.preventDefault();if(!mini||mini.type!=='question'||mini.won)return;const gate=letters[mini.i].gate,answers=Array.isArray(gate.answers)?gate.answers:[];if(answers.some(a=>norm(a)===norm($('question-answer').value))){$('question-answer').removeAttribute('aria-invalid');winChallenge();}else{$('question-answer').setAttribute('aria-invalid','true');$('challenge-status').textContent=gate.wrongMessage||'Not quite, my love. Try again. ♡';}};
$('close-challenge').onclick=()=>$('challenge').close();$('challenge').addEventListener('close',()=>{mini=null;updateAction();});
function miniTick(dt){if(!mini||!$('challenge').open||manualPause||document.hidden)return;mini.t+=dt;mini.shake=Math.max(0,mini.shake-dt*4);if(mini.won){mini.winAge+=dt;if(mini.winAge>1.05){const i=mini.i;$('challenge').close();openLetter(i);return;}}if(mini.type==='memory'&&mini.flipped.length===2){mini.flipAge+=dt;if(mini.flipAge>.95){for(const j of mini.flipped){const b=$('mini-buttons').children[j];b.classList.remove('flipped');b.textContent='✧';}mini.flipped=[];}}
 tickExtraChallenge(dt);
 if(mini.type==='rabbits'){mini.rabbits.forEach((r,j)=>{r.x=reduce?80+j*115:200+Math.sin(mini.t*(.6+j*.13)+r.p)*135;r.y=reduce?130+j*65:180+Math.sin(mini.t*.9+r.p)*75-Math.abs(Math.sin(mini.t*3+r.p))*18;r.button.style.left=`${r.x/4}%`;r.button.style.top=`${r.y/357*100}%`;});}
 mc.clearRect(0,0,400,357);
 // Ambient sparkles within each challenge, beneath touch targets.
 for(let j=0;j<18;j++){mc.globalAlpha=.15+.15*Math.sin(mini.t+j);mc.fillStyle='#ffcedd';mc.beginPath();mc.arc((j*83)%400,30+(j*53)%280,1.4,0,Math.PI*2);mc.fill();}mc.globalAlpha=1;
 if(mini.type==='treasure'){miniProp(mini.won?3:2,200+Math.sin(mini.t*65)*mini.shake*6,190,230,Math.sin(mini.t*65)*mini.shake*.03);if(mini.taps&&!mini.won){mc.strokeStyle='#ffe5b9';mc.lineWidth=2;for(let j=0;j<Math.min(mini.taps,6);j++){mc.beginPath();mc.moveTo(155+j*18,150);mc.lineTo(166+j*15,171);mc.lineTo(157+j*18,195);mc.stroke();}}}
 if(mini.type==='rabbits')mini.rabbits.forEach((r,j)=>{if(!mini.caught.has(j))miniProp(reduce?0:Math.floor(mini.t*5+j)%2,r.x,r.y,82);});
 if(mini.type==='constellation'){mc.strokeStyle='#f5b6d1';mc.lineWidth=2;mc.shadowColor='#ffb5d9';mc.shadowBlur=12;mc.beginPath();for(let j=0;j<mini.step;j++){const [px,py]=mini.points[j];if(j===0)mc.moveTo(px,py);else mc.lineTo(px,py);}if(mini.step===5)mc.closePath();mc.stroke();mc.shadowBlur=0;}
 mini.particles=mini.particles.filter(p=>p.life>0);for(const p of mini.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;mc.globalAlpha=Math.max(0,p.life);mc.fillStyle='#ffd0df';mc.font='16px Georgia';mc.fillText('♡',p.x,p.y);}mc.globalAlpha=1;
}
canvas.addEventListener('pointerup',e=>{if(phase!=='explore'||blocked())return;const r=canvas.getBoundingClientRect(),px=(e.clientX-r.left)/S,py=(e.clientY-r.top)/S;if(py<BASE-130||py>BASE+60)return;const target=!carrying&&Math.abs(px-(BOUQUET-camera))<80?'bouquet':letters.findIndex(l=>Math.abs(px-(l.x-camera))<60);if(target==='bouquet'&&Math.abs(x-BOUQUET)<155){near='bouquet';$('action').click();}else if(Number.isInteger(target)&&target>=0){if(Math.abs(x-letters[target].x)<140)requestLetter(target);else toast('Come a little closer. ♡');}});
resize();fitDialogs();let previousDraw=0,nextDraw=0;
function frame(ms){
 requestAnimationFrame(frame);
 if(document.hidden){previousDraw=ms;nextDraw=ms;return;}
 if(ms<nextDraw)return;
 const drawDt=clamp((ms-previousDraw)/1000||0,0,.08);previousDraw=ms;
 const interval=1000/(!reduce&&(romancePhase()||carrying||phase==='pickup')?60:45);nextDraw+=interval;if(nextDraw<ms)nextDraw=ms+interval-((ms-nextDraw)%interval);
 if(!manualPause){tick(drawDt);miniTick(drawDt);}ctx.clearRect(0,0,V,1000);drawWorld(total);effects(manualPause?0:drawDt,total);
}
requestAnimationFrame(frame);
if(document.modelContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'read_birthday_adventure',title:'Read adventure progress',description:'Read the current birthday adventure stage and completed letter challenges.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Expected an empty object.');return {started:active,stage:phase,collected:collected.size,letters:letters.length,bouquet:carrying,completed};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
})();

