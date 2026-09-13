# Unified girl animation artwork

The active artwork follows references/dress-reference.webp: plum hair and flower ornament, rose-pink off-shoulder high-low chiffon dress, long train and pink ankle-strap heels.

| Asset | Use |
| --- | --- |
| unified-walk.webp | Eight walking poses, empty hands |
| unified-pickup.webp | Standing idle and eight stages of kneeling/reaching |
| unified-bouquetWalk.webp | Eight walking poses with both hands holding roses |
| unified-bouquetPickup.webp | Bouquet idle and reaching with the free hand |

Related couple sheets in characters/boy use the same dress: unified-handKiss.webp, unified-spin.webp, unified-lean.webp, unified-embrace.webp and unified-intro.webp.

All nine exports are lossless RGBA WebP, with padded 640 by 720 frame cells and registered foot anchors. The source artwork is 1536 by 1024 per sheet; atlas enlargement does not add native detail. Existing artwork is retained as backup.

Standing height targets 245 logical game units against a 480-pixel reference. Kneeling and leaning keep their first frame's scale so bodies shorten naturally. Walking advances by distance (150 game units per eight-pose cycle), not rendering FPS. Pickup lasts 2.8 seconds, plays down and back up, and uses recorded hand coordinates for the letter. Flowers are part of the artwork, not a floating overlay.

Couple transitions reuse the exact endpoint image for the next sheet's first frame. Dance plays the spin followed by the supported lean at two poses per second. These are eight-pose illustrated sequences, not motion-captured animation.

Generation: built-in imagegen. Exact prompts are in references/animation-prompts.json. Source selection is in tools/girl-unified-sources.json; export and registration are in tools/build-girl-unified.cjs. Two generated sheets supplied alpha directly; the others required neutral-background extraction. No green matte was requested or used. Inspect output/girl-unified previews when changing the exporter.
