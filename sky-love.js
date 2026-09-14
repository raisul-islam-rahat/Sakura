(()=>{
 const app=document.getElementById('app');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const slots=Array.from({length:2},(_,i)=>{const el=document.createElement('div');el.id=i?'sky-love-line-next':'sky-love-line';el.className='sky-love-line';el.hidden=true;el.setAttribute('aria-hidden','true');app.append(el);return {el,age:7,needsFit:true};});
 let lines=[],lineIndex=0,nextSlot=0,untilNext=2,paintAge=0;
 new ResizeObserver(()=>slots.forEach(s=>s.needsFit=true)).observe(app);
 fetch('sky-love-lines.txt').then(r=>{if(!r.ok)throw Error('Love lines could not load');return r.text()}).then(text=>{lines=text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean)}).catch(e=>console.warn(e.message));
 function showLine(){
  const slot=slots[nextSlot],el=slot.el,position=nextSlot;nextSlot=1-nextSlot;
  const text=lines[lineIndex];lineIndex=(lineIndex+1)%lines.length;
  let charIndex=0;el.replaceChildren();
  text.split(' ').forEach((word,index)=>{if(index)el.append(' ');const wordEl=document.createElement('span');wordEl.className='sky-word';Array.from(word).forEach(char=>{const span=document.createElement('span');span.className='sky-letter';if(charIndex++%4===0)span.classList.add('star-tip');span.textContent=char;span.dataset.char=char;span.style.setProperty('--glow-delay',(-Math.random()*6)+'s');span.style.setProperty('--glow-duration',(2.8+Math.random()*3.2)+'s');wordEl.append(span);});el.append(wordEl);});
  slot.age=0;slot.needsFit=true;el.style.opacity='0';el.style.top=(position?24:12)+'%';el.style.setProperty('--sky-x',(40+Math.random()*20)+'%');
 }
 window.updateSkyLove=(dt,visible)=>{
  if(!visible||!lines.length){slots.forEach(s=>s.el.hidden=true);return;}
  untilNext-=dt;paintAge+=dt;
  // Start the next sentence before the current sentence's 1.8-second fade ends.
  if(untilNext<=0){showLine();untilNext=5.2;}
  const paint=paintAge>=1/24;if(paint)paintAge=0;
  for(const slot of slots){const el=slot.el;if(slot.age>=7){el.hidden=true;continue;}slot.age+=dt;el.hidden=false;
   if(slot.needsFit){el.style.setProperty('--sky-half',(el.getBoundingClientRect().width/2+18)+'px');slot.needsFit=false;}
   if(paint){el.style.opacity=String(Math.max(0,Math.min(1,slot.age/1.4,(7-slot.age)/1.8)));el.style.transform='translate(-50%, '+(reduce?0:-slot.age*1.4)+'px)';}
  }
 };
})();
