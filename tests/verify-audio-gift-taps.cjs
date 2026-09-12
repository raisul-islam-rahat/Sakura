const fs=require('fs');let setup=fs.readFileSync('tests/verify-celebration.cjs','utf8').split('let browser;try{')[0];
setup=setup.replace('ready,beginCakeCut,',`ready,audioProbe(){song.pause();song.play=()=>{window.letterPlays=(window.letterPlays||0)+1;return Promise.resolve();};return {loop:song.loop,backgroundLoop:bg.loop};},endAudio(){song.dispatchEvent(new Event('ended'));soundSync();},syncAudio:soundSync,beginCakeCut,`);
const body=String.raw`
let browser;try{browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:390,height:760},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.journeyQA);assert(await page.evaluate(()=>journeyQA.ready));
assert.deepEqual(await page.evaluate(()=>journeyQA.audioProbe()),{loop:false,backgroundLoop:true});
for(const [random,expected]of [[0,2],[.99999,10]]){
await page.evaluate(r=>{journeyQA.showWorld(3000);const old=Math.random;Math.random=()=>r;try{journeyQA.openLetter(4);}finally{Math.random=old;}},random);
assert.equal(await page.locator('.gift-progress').evaluate(e=>e.max),expected);assert.equal(await page.locator('.gift-progress').evaluate(e=>e.value),0);
for(let tap=1;tap<=expected;tap++){await page.locator('.gift-box').click();assert.equal(await page.locator('.gift-progress').evaluate(e=>e.value),tap);assert.equal(await page.locator('#gift-reveal').isVisible(),tap===expected);}
await page.locator('.gift-box').click();assert.equal(await page.locator('.gift-progress').evaluate(e=>e.value),expected);
const plays=await page.evaluate(()=>window.letterPlays);await page.evaluate(()=>{journeyQA.endAudio();journeyQA.syncAudio();journeyQA.syncAudio();});assert.equal(await page.evaluate(()=>window.letterPlays),plays,'Completed letter audio must not restart');
await page.evaluate(()=>journeyQA.closeLetter());await page.waitForTimeout(30);
}
assert.equal(await page.evaluate(()=>window.letterPlays),2,'Each new letter opening plays once');assert.equal(errors.length,0,errors.join('\n'));console.log('PASS: letter audio does not loop/restart after ending; reopen plays once; random 2 and 10 tap limits, progress, final-tap reveal and extra-tap guard.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});`;
new Function('require',setup+body)(require);
