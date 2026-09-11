(() => {
 'use strict';
 const gifts={
  5:['Premium chocolates','A little sweetness for the girl who makes my world sweeter.'],
  10:['Your soft white teddy','A little hug to keep beside you whenever you miss me.'],
  11:['Pretty little hair treasures','For all the ways you make an ordinary day beautiful.'],
  12:['Your enchanted mirror','Its most beautiful magic is the girl looking into it.'],
  13:['A little sip of love','For your sleepy mornings and every adventure in between.'],
  14:['A little sunshine','For my favourite girl beneath every sunny sky.'],
  15:['Our unwritten pages','There are still so many beautiful pages waiting for us.'],
  16:['A piece of the moon','So you can carry a little of our moonlit world with you.'],
  17:['Your signature sparkle','A little romance for your dressing table, my love.'],
  18:['Made of September starlight','A sapphire wish for the month that gave the world you.'],
  19:['Our little world','If I could keep one moment forever, it would be us.']
 };
 const stickerNames={5:['Heart chocolate','Gold-wrapped chocolate','Rose bonbon','Chocolate praline'],10:['White teddy bear'],11:['Pearl barrette','Satin bow clip','Silk scrunchie','Floral hair comb'],12:['Enchanted handheld mirror'],13:['Personalized water bottle','Personalized coffee mug'],14:['Pink sunglasses','Floral sunglasses case'],15:['Rose gold fountain pen','Floral diary'],16:['Moon pendant'],17:['Perfume','Lipstick'],18:['Sapphire necklace','Sapphire bracelet'],19:['Romantic music globe']};
 let section;
 window.showLetterGift=(number,eligible)=>{
  if(!section){section=document.createElement('section');section.id='letter-gift';section.setAttribute('aria-label','Your birthday gift');document.getElementById('message').before(section);}
  section.replaceChildren();section.className='';section.hidden=!eligible||!gifts[number];if(section.hidden)return;
  const [title,note]=gifts[number],hint=document.createElement('p'),button=document.createElement('button'),art=document.createElement('figure'),tray=document.createElement('div'),caption=document.createElement('figcaption');
  hint.className='gift-invitation';hint.textContent='A little surprise, just for you ♡';
  button.type='button';button.className='gift-box';button.setAttribute('aria-label','Open your gift');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','gift-reveal');
  for(const part of ['gift-glow','gift-base','gift-lid','gift-bow']){const span=document.createElement('span');span.className=part;span.setAttribute('aria-hidden','true');button.append(span);}
  const label=document.createElement('span');label.className='gift-tap';label.textContent='Tap to unwrap ♡';button.append(label);
  art.id='gift-reveal';art.hidden=true;tray.className='gift-stickers';tray.dataset.count=stickerNames[number].length;tray.setAttribute('role','group');tray.setAttribute('aria-label','Your gift stickers');
  stickerNames[number].forEach((name,index)=>{const img=document.createElement('img');img.className='gift-sticker';img.src=`assets/gifts/stickers/gift-${String(number).padStart(2,'0')}-${index+1}.webp`;img.alt=name;img.width=600;img.height=600;img.decoding='async';img.style.setProperty('--sticker-delay',`${index*.18}s`);tray.append(img);});
  const heading=document.createElement('strong');heading.textContent=title;const text=document.createElement('p');text.textContent=note;caption.append(heading,text);art.append(tray,caption);
  button.addEventListener('click',()=>{if(section.classList.contains('unwrapped'))return;section.classList.add('unwrapped');button.setAttribute('aria-expanded','true');art.hidden=false;label.textContent='Yours, with love ♡';});
  section.append(hint,button,art);
 };
})();
