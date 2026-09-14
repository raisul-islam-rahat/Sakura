(() => {
 let raf=0,finish=()=>{};
 const themes=['#fff0dc','#edf5ed','#eef0ff','#ffedf1','#f7edda','#e8f4f5','#f5ecff','#fff3dc','#e9effb','#fce9df','#eef4dc','#eeeaff','#fbe8ec','#e5f4f0','#fbefd2','#e8edfc','#f3e7fa','#edf3fa','#fceadb','#ffe8ef'];
 function decorateAurora(paper,index){
  paper.querySelectorAll('.keepsake-decor,.aurora-keepsake').forEach(el=>el.remove());
  const decor=document.createElement('div');decor.className='aurora-keepsake';decor.setAttribute('aria-hidden','true');
  decor.innerHTML='<svg class="aurora-moon" viewBox="0 0 120 120"><defs><linearGradient id="moon-metal"><stop stop-color="#fff5cf"/><stop offset=".45" stop-color="#96e7e2"/><stop offset="1" stop-color="#aa91d9"/></linearGradient></defs><path d="M84 13A47 47 0 1 0 94 94A45 45 0 0 1 84 13Z" fill="url(#moon-metal)" stroke="#fff6dc" stroke-width=".8"/><path d="M64 22C20 37 22 87 63 101M49 34L43 43L50 51L39 58L47 66L42 76L52 81" fill="none" stroke="#294e69" stroke-opacity=".55" stroke-width="1.2"/><path d="M47 29C13 60 36 97 58 100" fill="none" stroke="#fcf5df" stroke-opacity=".75"/></svg>';
  for(let i=0;i<24;i++){const star=document.createElement('i');star.className='aurora-star';star.textContent=i%3?'✧':'✦';star.style.cssText='left:'+((i*37+7)%96)+'%;top:'+((i*29+11)%88)+'%;--delay:'+(-i*.73)+'s;--duration:'+(4+i%4)+'s;--star-a:hsl('+((index*31+i*47)%360)+' 85% 82%);--star-b:hsl('+((index*31+i*47+100)%360)+' 85% 82%)';decor.append(star);}
  for(let i=0;i<2;i++){const balloon=document.createElement('i');balloon.className='aurora-balloon';balloon.style.cssText='left:'+(i?85:9)+'%;--delay:'+(-i*3)+'s';decor.append(balloon);}
  paper.insertBefore(decor,paper.querySelector('#message'));
 }
 window.writeBirthdayLetter=(text,index)=>{
  cancelAnimationFrame(raf);const box=document.getElementById('message'),dialog=document.getElementById('letter'),paper=dialog.querySelector('.paper');
  paper.style.setProperty('--paper',themes[index%20]);paper.style.setProperty('--ink',`hsl(${(index*29+315)%360} 27% 25%)`);paper.dataset.paper=index%5;dialog.classList.add('birthday-paper');
  decorateAurora(paper,index);box.scrollLeft=box.scrollTop=0;box.replaceChildren();const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=text;
  const visual=document.createElement('span');visual.className='diary-writing';visual.setAttribute('aria-hidden','true');const written=document.createElement('span'),remaining=document.createElement('span');remaining.style.visibility='hidden';remaining.textContent=text;visual.append(written,remaining);
  const pen=document.createElement('span');pen.className='writing-pen magic-wand';pen.innerHTML='<i class=wand-star>✦</i><i class=wand-spark>✧</i><i class=wand-spark>✦</i><i class=wand-spark>·</i>';pen.hidden=true;pen.setAttribute('aria-hidden','true');box.append(accessible,visual,pen);
  let count=0,last=performance.now(),elapsed=0;
  dialog.getAnimations().forEach(animation=>animation.cancel());if(!matchMedia("(prefers-reduced-motion: reduce)").matches)dialog.animate([{clipPath:"circle(0% at 50% 50%)",opacity:0},{clipPath:"circle(28% at 50% 50%)",opacity:.45,offset:.4},{clipPath:"circle(75% at 50% 50%)",opacity:1}],{duration:1100,easing:"cubic-bezier(.22,.61,.36,1)"});
  let decorated=false;
  finish=()=>{cancelAnimationFrame(raf);if(!decorated){decorated=true;const fragment=document.createDocumentFragment();Array.from(text).forEach((char,i)=>{if(/\s/.test(char)){fragment.append(char);return;}const glyph=document.createElement('span');glyph.className='letter-glyph';glyph.textContent=char;glyph.dataset.char=char;glyph.style.setProperty('--delay',(-i*.37%9)+'s');glyph.style.setProperty('--duration',(3.8+i%5*.6)+'s');fragment.append(glyph);});written.replaceChildren(fragment);}remaining.textContent='';pen.hidden=true;};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
  function step(now){const dt=Math.max(0,Math.min(now-last,60));last=now;if(!dialog.open)return;if(!document.hidden)elapsed+=dt;const next=Math.min(text.length,Math.max(0,Math.floor((elapsed-1200)*.055)));if(next!==count){count=next;written.textContent=text.slice(0,count);remaining.textContent=text.slice(count);if(count){pen.hidden=false;const range=document.createRange();range.setStart(written.firstChild,count-1);range.setEnd(written.firstChild,count);const rect=range.getBoundingClientRect(),base=box.getBoundingClientRect();pen.style.left=`${rect.right-base.left+box.scrollLeft}px`;pen.style.top=`${rect.top-base.top+box.scrollTop+8}px`;}}if(count===text.length){finish();return;}raf=requestAnimationFrame(step);}
  raf=requestAnimationFrame(step);
 };
 document.getElementById('letter').addEventListener('close',()=>{if(document.getElementById('letter').open)return;cancelAnimationFrame(raf);finish();});
})();
