(() => {
 let raf=0,finish=()=>{};
 const themes=['#fff0dc','#edf5ed','#eef0ff','#ffedf1','#f7edda','#e8f4f5','#f5ecff','#fff3dc','#e9effb','#fce9df','#eef4dc','#eeeaff','#fbe8ec','#e5f4f0','#fbefd2','#e8edfc','#f3e7fa','#edf3fa','#fceadb','#ffe8ef'];
 window.writeBirthdayLetter=(text,index)=>{
  cancelAnimationFrame(raf);const box=document.getElementById('message'),dialog=document.getElementById('letter'),paper=dialog.querySelector('.paper');
  paper.style.setProperty('--paper',themes[index%20]);paper.style.setProperty('--ink',`hsl(${(index*29+315)%360} 27% 25%)`);paper.dataset.paper=index%5;dialog.classList.add('birthday-paper');
  box.scrollLeft=box.scrollTop=0;box.replaceChildren();const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=text;
  const visual=document.createElement('span');visual.className='diary-writing';visual.setAttribute('aria-hidden','true');const written=document.createElement('span'),remaining=document.createElement('span');remaining.style.visibility='hidden';remaining.textContent=text;visual.append(written,remaining);
  const pen=document.createElement('span');pen.className='writing-pen';pen.textContent='✒';pen.setAttribute('aria-hidden','true');box.append(accessible,visual,pen);
  let skip=document.getElementById('finish-writing');if(!skip){skip=document.createElement('button');skip.id='finish-writing';skip.className='text-button';skip.textContent='Read the whole letter ♡';box.before(skip);}skip.hidden=false;
  let count=0,last=performance.now(),elapsed=0;
  finish=()=>{cancelAnimationFrame(raf);written.textContent=text;remaining.textContent='';pen.hidden=true;skip.hidden=true;};skip.onclick=finish;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
  function step(now){const dt=Math.max(0,Math.min(now-last,60));last=now;if(!dialog.open)return;if(!document.hidden)elapsed+=dt;const next=Math.min(text.length,Math.floor(elapsed*.085));if(next!==count){count=next;written.textContent=text.slice(0,count);remaining.textContent=text.slice(count);if(count){const range=document.createRange();range.setStart(written.firstChild,count-1);range.setEnd(written.firstChild,count);const rect=range.getBoundingClientRect(),base=box.getBoundingClientRect();pen.style.left=`${rect.right-base.left+box.scrollLeft}px`;pen.style.top=`${rect.top-base.top+box.scrollTop-12}px`;}}if(count===text.length){finish();return;}raf=requestAnimationFrame(step);}
  raf=requestAnimationFrame(step);
 };
 document.getElementById('letter').addEventListener('close',()=>{if(document.getElementById('letter').open)return;cancelAnimationFrame(raf);finish();});
})();
