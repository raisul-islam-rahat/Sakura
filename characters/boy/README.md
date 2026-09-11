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


Hand kiss: anime-hand-kiss-8.png, generated with built-in imagegen using anime-hands.png as identity reference. Prompt: eight sequential poses, standing girl left, kneeling white-suit boy right, lifting her hand, bowing, lips contacting the back of her hand, lingering, looking up; exactly two arms and legs each, no bouquet, green background. Asset uses 4 columns x2 rows. Cake generated with built-in imagegen: transparent romantic blush/ivory cake, roses, pearl piping, golden crown and exact Happy birthday my princess inscription.


Opening scene assets: intro-black-roses.png (12 poses, 4x3) and intro-rose-handover.png (8 poses, 4x2), with frame bounds in actor.json. Created using built-in imagegen with existing character references. Prompt: preserve the adult anime characters; boy in an elegant black suit walks with roses then kneels and offers them; separate sequential handover sheet with pink-dressed girl accepting the bouquet; exactly two arms per character, consistent full-body scale, solid green background. Runtime removes green and crops grid borders. Timing and scene transitions are in beginFlowerIntro, tickFlowerIntro and drawFlowerIntro in game.js.

Green fringe cleanup: all active boy/couple sheets now use real RGBA PNGs ending in -alpha.png. Exported with tools/bake-boy-alpha.cjs; alpha and visible green spill verified across all 13 active girl/boy/couple sheets. Runtime keying also defaults to the stronger edge cleanup for future green assets. Hand-kiss zoom is capped at 1.5 instead of 3.4. anime-hand-kiss-polished-alpha.png uses built-in imagegen polish of the original eight poses: preserve placements, identities, two arms each, gentle hand contact, improve facial/hair/finger/dress detail, clean silhouette. The generated green matte was removed before shipping. Browser celebration and romance timing checks passed.
New hand-kiss pose: hand-kiss-hd.webp, lossless 1254x1254 with verified alpha. Built-in imagegen prompt: one new full-body adult anime couple pose, detailed pink embroidered gown and white suit, boy kneeling and kissing the back of her hand, clear face/wrist separation, detailed faces/hands, complete silhouettes. Generated neutral checkerboard removed by tools/build-hand-kiss-hd.cjs. Replaces the hand-kiss sequence with a held high-detail pose and gentle existing sway at 1.5x maximum zoom.

Fresh animated artwork replacement (September 12): hand-kiss-new-8.webp is a 2800x1400 eight-frame transparent atlas; dance-new-16.webp is a 2800x2800 sixteen-frame transparent atlas. Each frame has a padded 700px cell and its own ground anchor/reference scale. These are newly generated poses, not enlarged old frames. Hand kissing again lifts, kisses, lingers and releases over 6.4 seconds; the single held HD pose is no longer loaded. Modest maximum 1.5x hand-kiss zoom remains. Dance proceeds through front/profile/back/profile turn, return, supported dip and recovery.
Built-in imagegen prompt set: adult anime girl with dark flowing hair, pink embroidered gown and heels; adult dark-haired boy in white suit; exactly four full-couple poses per 2x2 sheet, consistent scale, correct two arms/two legs, detailed faces/fingers/fabric, complete silhouettes. Two sheets cover hand lift/contact/release and four cover spin, approach, dip, recovery. Pure blue matte requested for deterministic extraction; final lossless WebPs have actual alpha, no runtime matte. Sources: tools/romance-art-sources.json. Build: tools/build-romance-2026.cjs. All visible pixels tested for residual blue/green spill and real alpha verified. Romance timing and browser celebration checks passed.
Alignment correction: dance-aligned-16.webp uses the actual 582px row boundary for the recovery source, preserving the lower-row heads and removing upper-row contamination. Dance frames use a shared 420px horizontal anchor and 540px reference height; the rise bridge uses 320px anchor and 635px reference height. Wide camera is capped at 1.4x so the hand-kiss exits into the same camera scale. No additional artwork generation or image enlargement was used.
