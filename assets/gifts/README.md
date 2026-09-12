# Birthday gifts

Eleven gift boxes now reveal 22 individual transparent, white-outlined WebP stickers. Gifts appear only for challenge letters 5 and 10–19. Letter 20 and direct-open letters have no gift. Clicking or keyboard-activating a box opens the lid and reveals each sticker with a staggered animation and dedication. Reopening wraps the gift again. Reduced motion skips animation.

Active assets: `assets/gifts/stickers/gift-NN-I.webp`. Mapping and copy: `letter-gifts.js`. Artwork sources and individual subject prompts: `tools/gift-sticker-sources.json`. Export: `tools/build-gift-stickers.cjs`. Preview: `output/gift-sticker-gallery.png`. Older rectangular gift images remain as unused originals.

Generated with built-in imagegen. Shared prompt: separate isolated high-definition romantic gift objects, one per cell, refined ivory/blush/rose-gold materials, crisp realistic texture, complete silhouettes, white die-cut border, no surface/scenery/props or rectangular photo frame. Production matte requested for reliable extraction; generated alpha is preserved when present. Export splits each object, removes disconnected specks, adds a continuous white silhouette border, pads the transparent edges, and saves lossless WebP.

Counts: 5 four chocolates; 10 teddy; 11 four hair accessories; 12 mirror; 13 bottle and mug; 14 sunglasses and case; 15 pen and diary; 16 moon pendant; 17 perfume and lipstick; 18 sapphire necklace and bracelet; 19 music globe.

Validated with `node tests/verify-gift-stickers.cjs` (22 separate alpha WebPs, white edges and clear padding) and `node tests/verify-letter-gifts.cjs` (challenge completion, item counts and mappings, unwrapping, exclusions, reopening, reduced motion and browser errors).

Reading/unwrapping update: the message uses its full natural height with horizontal scrolling, and the diary dialog owns vertical scrolling. Gifts follow the signature so unopened boxes never gate reading. Red/gold boxes have an animated tapping hand. Clicking triggers a sparkle burst, then individually staggered stickers scale from 6% at measured box coordinates to full size. Reduced motion reveals immediately. tests/verify-gift-scroll.cjs verifies a 50-line diary can reach its final line with a closed gift, plus the red box, hint and launch effects.
Gift placement restored above the message. The full-height message/outer-dialog scroll remains, so all lines are reachable before unwrapping. The letter-writing skip button was removed; the pen reveal completes automatically.
Each box now chooses 2–10 taps per opening. A native progress bar and live tap count sit underneath. Only the final tap runs the sparkle/sticker reveal; extra taps do nothing. Letter WAV playback has looping disabled and remembers completion for that opening, so pause/mute/visibility synchronization cannot restart it. Reopening a letter permits one new play. Verified with tests/verify-audio-gift-taps.cjs.
