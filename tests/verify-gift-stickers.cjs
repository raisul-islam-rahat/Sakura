const fs=require('fs'),assert=require('assert'),sharp=require('C:/Users/Raisul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{const jobs=require('../tools/gift-sticker-sources.json');let count=0;
for(const job of jobs)for(let i=0;i<job.items.length;i++){
 const path=`assets/gifts/stickers/gift-${String(job.number).padStart(2,'0')}-${i+1}.webp`,meta=await sharp(path).metadata(),{data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert(meta.hasAlpha,path+' needs real alpha');let clear=0,white=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const p=(y*info.width+x)*4;if(!data[p+3])clear++;if(data[p+3]>200&&Math.min(data[p],data[p+1],data[p+2])>245)white++;if(x<8||y<8||x>=info.width-8||y>=info.height-8)assert.equal(data[p+3],0,path+' rectangular edge');}
 assert(clear>info.width*info.height*.1,path+' background');assert(white>100,path+' white outline');count++;
}
assert.equal(count,22);console.log('PASS: 22 individual WebPs, real transparency, white edges and clear outer padding.');
})().catch(e=>{console.error(e);process.exitCode=1});
