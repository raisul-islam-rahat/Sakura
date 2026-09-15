(()=>{
 const colors=['#ef9dbb','#e7c46d','#b7c6ee','#d7b2e8'];
 window.decorateKeepsake=(host,index=0,burst=false)=>{
  host.querySelectorAll(burst?':scope > .party-burst':':scope > .keepsake-decor').forEach(el=>el.remove());
  const strip=document.createElement('div');strip.className=burst?'party-burst':'keepsake-decor';strip.setAttribute('aria-hidden','true');
  const count=burst?9:4;for(let i=0;i<count;i++){const el=document.createElement('i');el.className=burst||((index+i)%3!==0)?'party-balloon':'party-candle';el.style.setProperty('--x',(burst?8+i*10:[3,14,77,89][i])+'%');el.style.setProperty('--delay',(burst?i*.13:-i*.7)+'s');el.style.setProperty('--balloon',colors[(index+i)%4]);strip.append(el);}
  if(burst){for(let i=0;i<32;i++){const star=document.createElement('i');star.className='treasure-twinkle';star.textContent=i%3?'✦':'♡';const angle=i*Math.PI*2/32;star.style.setProperty('--dx',Math.cos(angle)*(90+i%4*25)+'px');star.style.setProperty('--dy',Math.sin(angle)*(100+i%5*25)+'px');star.style.setProperty('--delay',i%6*.07+'s');strip.append(star);}}
  if(!burst){const caption=document.createElement('span');caption.className='keepsake-caption';caption.textContent=['A little birthday magic','A wish, wrapped in love','For my favourite person','Twenty years of you'][index%4];strip.append(caption);const before=host.querySelector('#message,#gift-reveal,#playfield');host.insertBefore(strip,before||null);}else host.append(strip);
 };
})();


(()=>{
 const dialog=document.getElementById('challenge'),paper=dialog.querySelector('.challenge-paper'),field=document.getElementById('playfield');
 function alignTreasureWindow(){if(!dialog.open||!dialog.classList.contains('gift-encounter'))return;const left=field.offsetLeft+7,top=field.offsetTop+7;paper.style.setProperty('--window-left',left+'px');paper.style.setProperty('--window-top',top+'px');paper.style.setProperty('--window-right',left+field.clientWidth+'px');paper.style.setProperty('--window-bottom',top+field.clientHeight+'px');}
 new ResizeObserver(alignTreasureWindow).observe(paper);new ResizeObserver(alignTreasureWindow).observe(field);new MutationObserver(()=>requestAnimationFrame(alignTreasureWindow)).observe(dialog,{attributes:true,attributeFilter:['open','class']});
})();

// A consistent scroll handle on browsers that ignore native scrollbar styling.
(()=>{const bound=new WeakSet();function attach(){document.querySelectorAll('dialog').forEach(dialog=>{if(bound.has(dialog))return;bound.add(dialog);dialog.classList.add('custom-scroll');const rail=document.createElement('div'),thumb=document.createElement('div');rail.className='card-scroll-rail';thumb.className='card-scroll-thumb';rail.setAttribute('aria-hidden','true');rail.append(thumb);dialog.prepend(rail);let pending=false;function update(){pending=false;const range=dialog.scrollHeight-dialog.clientHeight;rail.hidden=range<2;thumb.style.transform='translateY('+(12+Math.min(Math.max(0,range),Math.max(0,dialog.scrollTop))/Math.max(1,range)*Math.max(0,dialog.clientHeight-84))+'px)';}function queue(){if(!pending){pending=true;requestAnimationFrame(update);}}dialog.addEventListener('scroll',queue,{passive:true});
let touchY=0,touchX=0;
dialog.addEventListener('touchstart',e=>{if(e.touches.length===1){touchY=e.touches[0].clientY;touchX=e.touches[0].clientX;}},{passive:true});
dialog.addEventListener('touchmove',e=>{if(e.touches.length!==1)return;const y=e.touches[0].clientY,x=e.touches[0].clientX,dy=y-touchY,dx=x-touchX;touchY=y;touchX=x;if(Math.abs(dx)>Math.abs(dy))return;const max=Math.max(0,dialog.scrollHeight-dialog.clientHeight);if((dy>0&&dialog.scrollTop<=0)||(dy<0&&dialog.scrollTop>=max-1)){if(e.cancelable)e.preventDefault();}},{passive:false});new ResizeObserver(queue).observe(dialog);new MutationObserver(queue).observe(dialog,{attributes:true,attributeFilter:['open'],childList:true,subtree:true});let start=0,scroll=0;thumb.onpointerdown=e=>{start=e.clientY;scroll=dialog.scrollTop;thumb.setPointerCapture(e.pointerId);e.preventDefault();};thumb.onpointermove=e=>{if(thumb.hasPointerCapture(e.pointerId))dialog.scrollTop=Math.max(0,Math.min(dialog.scrollHeight-dialog.clientHeight,scroll+(e.clientY-start)*(dialog.scrollHeight-dialog.clientHeight)/Math.max(1,dialog.clientHeight-84)));};queue();});}new MutationObserver(attach).observe(document.body,{childList:true,subtree:true});attach();})();
