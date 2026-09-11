const fs=require('fs');
let setup=fs.readFileSync('tests/verify-celebration.cjs','utf8').split('let browser;try{')[0];
setup=setup.replace('ready,beginCakeCut,','ready,startChallenge,winChallenge,beginCakeCut,');
const checks=String.raw`
let browser;try{
browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:430,height:900},reducedMotion:'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.journeyQA);assert(await page.evaluate(()=>journeyQA.ready));
await page.evaluate(()=>{journeyQA.showWorld(3000);journeyQA.startChallenge(4);});
assert(await page.locator('#challenge').evaluate(e=>e.open));assert.equal(await page.locator('#letter-gift').count(),0);
await page.evaluate(()=>journeyQA.winChallenge());await page.waitForSelector('#letter[open]');
assert(await page.locator('.gift-box').isVisible());assert(await page.locator('#gift-reveal').isHidden());
await page.screenshot({path:'output/letter-gift-wrapped.png'});
await page.locator('.gift-box').click();await page.waitForFunction(()=>document.querySelector('#gift-reveal img').naturalWidth>0);await page.waitForTimeout(1200);
assert.equal(await page.locator('.gift-box').getAttribute('aria-expanded'),'true');await page.locator('#gift-reveal').scrollIntoViewIfNeeded();await page.screenshot({path:'output/letter-gift-unwrapped.png'});
const giftNumbers=[5,10,11,12,13,14,15,16,17,18,19];
for(let number=1;number<=20;number++){
 await page.evaluate(n=>{journeyQA.closeLetter();journeyQA.openLetter(n-1);},number);
 if(giftNumbers.includes(number)){assert(await page.locator('#letter-gift').isVisible());assert(await page.locator('#gift-reveal').isHidden());await page.locator('.gift-box').click();await page.waitForFunction(()=>document.querySelector('#gift-reveal img').complete&&document.querySelector('#gift-reveal img').naturalWidth>0);assert((await page.locator('#gift-reveal img').getAttribute('src')).endsWith('gift-'+String(number).padStart(2,'0')+'.webp'));}
 else assert(await page.locator('#letter-gift').isHidden());
}
await page.evaluate(()=>journeyQA.closeLetter());await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>journeyQA.openLetter(9));await page.locator('.gift-box').click();assert.equal(await page.locator('#gift-reveal').evaluate(e=>getComputedStyle(e).animationName),'none');
assert.equal(errors.length,0,errors.join('\n'));console.log('PASS: challenge completion unlocks box, 11 correct gifts unwrap, direct letters and 20 have none, reopen resets, reduced motion, no browser errors.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});`;
new Function('require',setup+checks)(require);
