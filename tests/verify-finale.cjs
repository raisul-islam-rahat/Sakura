const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('game.js','utf8'),nodes={};
function element(id){return nodes[id]??={open:false,style:{setProperty(){}},classList:{add(){},remove(){}},events:{},addEventListener(n,f){this.events[n]=f},focus(){},showModal(){this.open=true},close(){this.open=false},setPointerCapture(){}};}
const c={$:element,phase:'embrace',window:{addEventListener(){}},document:{addEventListener(){}},chime(){},blocked:()=>false,setPhase(p){c.phase=p;vm.runInContext('cutHeld=false',c)}};vm.createContext(c);
vm.runInContext(src.slice(src.indexOf('let loveNoCount='),src.indexOf('function finishFinaleVideo')),c);
c.askLove();assert.equal(c.phase,'loveQuestion');for(let i=1;i<=5;i++){element('love-no').onclick();assert.equal(element('love-plea').textContent,'please '.repeat(i)+'say yes ♡');assert.equal(c.phase,'loveQuestion');}element('love-yes').onclick();assert.equal(c.phase,'kiss');assert.equal(element('love-question').open,false);
c.beginCakeCut();c.tickCakeCut(5);assert.equal(element('cut-progress').value,0);
element('cut-button').events.pointerdown({button:0,pointerId:1,preventDefault(){}});c.tickCakeCut(1);assert.equal(element('cut-progress').value,1/3);element('cut-button').events.pointerup();c.tickCakeCut(5);assert.equal(element('cut-progress').value,1/3);
element('cut-button').events.keydown({key:' ',preventDefault(){}});c.tickCakeCut(2);assert.equal(element('cut-progress').value,1);assert.equal(c.phase,'cutCake');c.tickCakeCut(1.9);assert.equal(c.phase,'tilt');
c.askLove();assert.equal(element('love-plea').textContent,'');c.beginCakeCut();assert.equal(element('cut-progress').value,0);
console.log('PASS: repeated No, Yes gates kiss, hold/release and keyboard cutting, completion delay, replay resets');
