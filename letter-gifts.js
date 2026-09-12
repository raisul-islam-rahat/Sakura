(() => {
 'use strict';
 const gifts={
  5:['Lovely chocolates','A little sweetness for the girl who makes my world sweeter.'],
  10:['Your soft white teddy','A little hug to keep beside you whenever you miss me.'],
  11:['A crown for my princess','For the girl who reigns over my heart, today and always.'],
  12:['Your enchanted mirror','Its most beautiful magic is the girl looking into it.'],
  13:['A little sip of love','For your sleepy mornings and every adventure in between.'],
  14:['A little sunshine','For my favourite girl beneath every sunny sky.'],
  15:['Our unwritten pages','There are still so many beautiful pages waiting for us.'],
  16:['A piece of the moon','So you can carry a little of our moonlit world with you.'],
  17:['Your signature sparkle','A little romance for your dressing table, my love.'],
  18:['Made of September starlight','A sapphire wish for the month that gave the world you.'],
  19:['Our little world','If I could keep one moment forever, it would be us.']
 };
 const stickerNames={5:['Heart chocolate','Gold-wrapped chocolate','Rose bonbon','Chocolate praline'],10:['White teddy bear'],11:['Rose-gold princess crown'],12:['Enchanted handheld mirror'],13:['Personalized water bottle','Personalized coffee mug'],14:['Pink sunglasses','Floral sunglasses case'],15:['Rose gold fountain pen','Floral diary'],16:['Moon pendant'],17:['Perfume','Lipstick'],18:['Sapphire necklace','Sapphire bracelet'],19:['Romantic music globe']};

 let dialog,section,revealTimer;const received=new Set();
 window.resetLetterGifts=()=>{received.clear();clearTimeout(revealTimer);dialog?.close();};
 window.offerLetterGift=(number,eligible,onRead)=>{
  if(!eligible||!gifts[number]||received.has(number))return false;
  if(dialog?.open)return true;
  window.startGiftTreasure(number,()=>{
   clearTimeout(revealTimer);
   if(!dialog){dialog=document.createElement('dialog');dialog.id='gift-treasure';dialog.setAttribute('aria-label','Your birthday gift');section=document.createElement('section');section.id='letter-gift';dialog.append(section);document.body.append(dialog);}
   section.replaceChildren();section.className='unwrapped gift-launched';
   const close=document.createElement('button');close.type='button';close.className='close';close.textContent='×';close.setAttribute('aria-label','Return to the journey');close.onclick=()=>dialog.close();
   const hint=document.createElement('p');hint.className='gift-invitation';hint.textContent='A gift, just for you ♡';
   const art=document.createElement('figure');art.id='gift-reveal';const tray=document.createElement('div');tray.className='gift-stickers';tray.dataset.count=stickerNames[number].length;
   stickerNames[number].forEach((name,index)=>{const img=document.createElement('img');img.className='gift-sticker';img.src=number===11?'assets/gifts/stickers/gift-11-crown.webp':'assets/gifts/stickers/gift-'+String(number).padStart(2,'0')+'-'+(index+1)+'.webp';img.alt=name;img.width=600;img.height=600;img.style.setProperty('--sticker-delay',index*.18+'s');img.style.setProperty('--launch-x','0px');img.style.setProperty('--launch-y','90px');tray.append(img);});
   const caption=document.createElement('figcaption'),heading=document.createElement('strong'),note=document.createElement('p');heading.textContent=gifts[number][0];note.textContent=gifts[number][1];caption.append(heading,note);art.append(tray,caption);
   const sparkles=document.createElement('span');sparkles.className='gift-sparkles';sparkles.setAttribute('aria-hidden','true');for(let i=0;i<42;i++){const star=document.createElement('i'),angle=i*Math.PI*2/42;star.textContent='✦';star.style.setProperty('--spark-x',Math.cos(angle)*(70+i%5*20)+'px');star.style.setProperty('--spark-y',Math.sin(angle)*(70+i%5*20)+'px');star.style.setProperty('--spark-delay',i%7*.04+'s');sparkles.append(star);}
   const read=document.createElement('button');read.type='button';read.className='primary gift-read-letter';read.textContent='Open my letter ♡';read.disabled=true;read.onclick=()=>{if(read.disabled)return;read.disabled=true;received.add(number);dialog.close();onRead();};
   section.append(close,hint,sparkles,art,read);dialog.showModal();dialog.scrollTop=0;revealTimer=setTimeout(()=>{if(dialog.open)read.disabled=false;},matchMedia('(prefers-reduced-motion: reduce)').matches?0:2100);
  });return true;
 };
})();
