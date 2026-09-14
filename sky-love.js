(()=>{
 const el=document.createElement('div');el.id='sky-love-line';el.hidden=true;el.setAttribute('aria-hidden','true');document.getElementById('app').append(el);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let lines=[],lineIndex=0,age=0,wait=2,showing=false,needsFit=true,paintAge=0;
 new ResizeObserver(()=>{needsFit=true;}).observe(el.parentElement);
 fetch('sky-love-lines.txt').then(r=>{if(!r.ok)throw Error('Love lines could not load');return r.text()}).then(text=>{lines=text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean)}).catch(e=>console.warn(e.message));
 function nextLine(){const line=lines[lineIndex];lineIndex=(lineIndex+1)%lines.length;return line;}
 window.updateSkyLove=(dt,visible)=>{
  if(!visible||!lines.length){if(!el.hidden)el.hidden=true;return;}
  if(!showing){wait-=dt;if(wait>0)return;const text=nextLine();let charIndex=0;const glints=new Set(),length=text.replace(/ /g,'').length;while(glints.size<Math.min(3,length))glints.add(Math.floor(Math.random()*length));el.replaceChildren();text.split(' ').forEach((word,index)=>{if(index)el.append(' ');const wordEl=document.createElement('span');wordEl.className='sky-word';Array.from(word).forEach(char=>{const span=document.createElement('span');span.className='sky-letter';if(glints.has(charIndex++))span.classList.add('sky-glint');span.textContent=char;span.style.setProperty('--glow-delay',(-Math.random()*6)+'s');span.style.setProperty('--glow-duration',(2.8+Math.random()*3.2)+'s');wordEl.append(span);});el.append(wordEl);});needsFit=true;paintAge=0;age=0;showing=true;el.style.top=(13+Math.random()*8)+'%';el.style.setProperty('--sky-x',(35+Math.random()*30)+'%');}
  el.hidden=false;age+=dt;paintAge+=dt;
  if(needsFit){el.style.setProperty('--sky-half',(el.getBoundingClientRect().width/2+18)+'px');needsFit=false;}
  // The overlay needs only 24 updates/second; the canvas keeps its own cadence.
  if(paintAge>=1/24){paintAge=0;el.style.opacity=String(Math.max(0,Math.min(1,age/1.4,(7-age)/1.8)));el.style.transform='translate(-50%, '+(reduce?0:-age*1.4)+'px)';}
  if(age>=7){showing=false;el.hidden=true;wait=3+Math.random()*3;}
 };
})();
