# Anime boy assets

The active boy is an adult anime character in a white suit, matching the girl's illustrated style.

- `anime-walk.png`: eight walking poses.
- `anime-carry.png`: eight walking poses with the cake, plate and supporting hands drawn together.
- `anime-poses.png`: idle, lowering to one knee, offering a hand, and standing with the cake.
- `anime-hands.png`: matching anime hand-holding scene.
- `actor.json`: frame rectangles, ground anchors, scale, candle coordinates and sheet references.

Walking frames advance by distance travelled (`strideDistance`, default 130 game units per full cycle), so footsteps slow when he eases to a stop. `boyWalkSpeed` in config.js controls travel speed. Artwork faces right; the renderer mirrors the full pose for walking toward the girl.

The cake stays in his hands through the candle scene. Its small candle flame is drawn at each pose's candle anchor; there is no separate floating cake sprite. Reduced-motion mode uses standing poses during travel.

The generated PNGs have solid green backgrounds. `chromaKey: "green"` removes these once while loading, preserving white clothing. Original V3 artwork remains in this folder but is no longer referenced.

Generated using the built-in image generation tool. Prompt set:
1. Exact romantic anime style of the girl; adult clean-shaven dark-haired man in an elegant white suit; confident upright eight-frame walk with contact, down, passing, up and opposite-leg phases; fixed scale, full shoes, 4x2 grid; transparency or solid green background.
2. Same man and walk cycle, holding a small pink/ivory cake on a gold plate with both palms underneath and elbows bent; cake/hands illustrated together, single unlit candle, consistent size.
3. Same man in four full-body poses: idle, lowering to kneel, offering hand while kneeling, and standing holding the same cake. Ground aligned and kneeling figures kept at the same body scale.
4. Preserve the original hand-holding composition and pink-dressed girl; replace the realistic man with the matching anime man, one knee down, hands joined.

Verification: `node tests/verify-boy.cjs` checks loading, frame bounds, chroma removal, cycle selection, and produces still/animated renderer previews in `output/`. `node tests/verify-pickup.cjs` covers existing girl pickup behavior.

## Close-up dance and kiss

Tapping Hold his hand now runs: hand-holding close-up (3.2 s), rise (1.6 s), dance, embrace (1.8 s), gentle lip kiss (3.6 s), release and camera pullback (3.2 s), then the existing cake sequence.

`config.js` settings `finale.danceCycles` and `finale.danceFPS` default to 20 loops and 8 sprite poses per second. There are 20 distinct poses, so the dance lasts 50 seconds at defaults. The canvas targets 60 FPS during this sequence; the artwork updates at its configured pose rate. Actual rendering performance depends on the device. Reduced-motion mode keeps the sequence but uses a still dance pose and gentler zoom.

New sheets: `anime-rise.png` (four poses), `anime-dance.png` (20 poses), `anime-embrace.png` (six poses). Fixed frame bounds and ground anchors are stored in actor.json. Artwork is generated sprite animation, not a skeletal rig or interpolated video.

Built-in image generation prompt set:
- Exact adult anime couple from anime-hands.png; 20 sequential full-body partner ballet poses, joined hands, guided turn, side step, gentle supported dip and return to starting stance; pink dress and white suit; fixed body scale, 5x4 grid, transparent or uniform green background.
- Same adult couple; six poses from joined hands to waist embrace, gentle closed-mouth kiss on the lips, and easing apart smiling; fully clothed, consistent anatomy, 3x2 grid, transparent or green background.
- Same couple; four incremental poses of the boy rising from one knee while holding the standing girl's hand, ending ready to dance, with fixed scale and ground alignment.

`node tests/verify-romance.cjs` verifies the ordered sequence, 20 full loops, pause, camera reset, cake continuation, frame bounds, and produces portrait and animated previews.

36-frame spin update: anime-dance-36.png uses 6x6 frames, each padded and aligned to the same foot baseline. Built-in imagegen prompt: same couple, full clockwise underarm turn through right profile, back, left profile, front, and right profile; two arms/legs per person; no bouquet. The kiss edit prompt requested actual closed-mouth lip contact in embrace frames 3 and 4; the other four frames were preserved. Playback is 8 poses/second, one 4.5-second turn; configure danceFPS and danceCycles in config.js. Raw generated image paths are recorded in tools/build-romance-sheets.cjs.


Latest replacement: anime-spin-dip-16.png supersedes the 36-pose sheet. Built-in imagegen prompt: same couple, eight full-turn orientations in top row and eight supported backward-lean/recovery poses in bottom row, green background, exactly two arms and legs each, fixed full-body scale. Padded 320x384 cells share a fixed ground baseline.

