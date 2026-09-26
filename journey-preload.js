(() => {
  let started = false;
  window.preloadJourney = (letters, config) => {
    if (started) return;
    started = true;
    const urls = [];
    for (const letter of letters) {
      if (letter.music) urls.push(letter.music);
      if (letter.picture) urls.push(letter.picture);
      if (letter.animation?.file) urls.push(`${letter.folder}/${letter.animation.file}`);
      if (letter.gate?.sound) urls.push(`${letter.folder}/${letter.gate.sound}`);
    }
    const counts = {5:4,10:1,12:1,15:2,16:1,17:2,18:2,19:1};
    for (const [number, count] of Object.entries(counts)) {
      for (let i=1;i<=count;i++) urls.push(`assets/gifts/stickers/gift-${number.padStart(2,'0')}-${i}.webp`);
    }
    urls.push(...['gift-11-crown','gift-13-headphones','gift-13-keychain','gift-14-muno-handbag-blue'].map(name=>`assets/gifts/stickers/${name}.webp`));
    urls.push('assets/realistic-jaan-cake.png','assets/realistic-jaan-cake-cut.webp','assets/cake-celebration.wav');
    const queue = [...new Set(urls)];
    async function warm(url) {
      for (let attempt=0;attempt<2;attempt++) {
        try {
          const response = await fetch(url,{cache:'force-cache',priority:'low'});
          if (!response.ok) { await response.body?.cancel(); return; }
          // Drain into the browser cache without retaining decoded media in memory.
          if (response.body) { const reader=response.body.getReader(); while (!(await reader.read()).done) {} }
          else await response.arrayBuffer();
          return;
        } catch { /* A failed warm-up never blocks the adventure. */ }
      }
    }
    async function worker() { while(queue.length) await warm(queue.shift()); }
    // Two low-priority requests at a time; the large finale video comes last.
    Promise.all([worker(),worker()]).then(()=>warm(config.finale?.video||'video/1.mp4'));
  };
})();
