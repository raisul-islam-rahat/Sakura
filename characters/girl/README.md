# Girl customization

`walk-padded.png` is the active eight-pose walking sheet. The original `walk.webp` remains as a reference. `actor.json` controls this character.

Useful settings:

- `displayHeight`: character height in game units (default245).
- `cycleSeconds`: time to play all eight walking poses (default0.96).
- `walkFrames`: pose order, normally0–7.
- `idleFrame`: pose used while standing still.
- `bouquetOffset`: rose position relative to the character anchor; x/right, y/down, size.

The supplied `frames` array contains source image rectangles and fixed ground/head anchor coordinates. `fixedScale` uses one `referenceHeight` for every pose; do not set it to false merely to fit replacement art, because that can reintroduce size jitter.

For another sprite sheet with exactly the same layout/dimensions/registration, replace `walk.webp` directly. For a different sheet, update its `image`, `columns`, `rows`, `referenceHeight` and frame bounds/anchors. Setting `frames` to an empty array enables a basic equal-cell fallback, but custom alignment gives better results.

Keep true transparency and full bodies inside their frame rectangles. Adding more files to this folder alone does not activate them; reference them in actor.json or the game code.

## Pickup animation

`pickup.png` contains eight standing-to-kneeling/reaching poses generated with the built-in image generation tool, using `walk.webp` as the character reference. The `pickup` settings in `actor.json` define frame bounds, foot anchors, hand positions and the 2.3-second duration. Frames play forward to reach, pause briefly, then reverse to stand. The renderer removes the generated neutral checkerboard at load time; the source PNG is not transparent.

The game approaches the item, locks movement during pickup, then opens the letter challenge after standing. Already collected letters reopen directly. Pickup pauses with the game.

Prompt: Match the adult anime woman in walk.webp, including purple hair, sakura ornament, pink layered dress and heels. Generate eight consistent full-body side-facing poses progressing from standing through knee bend, squat, kneeling and reaching toward the ground, with fixed character scale and empty hands. A second built-in edit requested transparent background while preserving poses; runtime neutral-background removal was needed for the returned image.

## Padded walking artwork

The active walking sheet uses full 443–444 px square cells, fixed scale and foot anchors. All eight poses have at least 17 px of clear background at every frame boundary after the existing green-key renderer loads the sheet. This preserves the full dress train, hair, toes and heels without tight crop rectangles. Display height and walk timing remain unchanged.

Generated with the built-in image generation tool, using the old walk.webp as the identity/style reference. Prompt: rebuild eight chronological right-facing walking poses of the same adult anime woman, same purple hair, sakura ornament, layered pink dress and heels; longer complete flowing train, larger square cells with generous empty margins around all sides; fixed body scale and foot baseline; full shoes and rounded hems, no cropped silhouettes; transparent or uniform green background.

Run `node tests/verify-girl-walk.cjs` to check every frame's visible-pixel margins and render still and animated previews.

## Bouquet held in the artwork

After flower pickup, `bouquet-walk.png` provides 16 poses with the roses cradled by her arm and fingers drawn around the stems. `bouquet-pickup.png` provides matching standing/crouching poses; the free hand reaches for letters. No separate bouquet prop is drawn while she carries it. Initial flower pickup blends into the held-bouquet pose over 0.18 seconds.

The carried walk uses `sheets.girl-bouquet-walk.cycleSeconds: 1.28` in actor.json (16 poses, about 12.5 poses/second at full walking speed). Increasing cycleSeconds slows the pose cycle. Canvas rendering targets 60 FPS while carrying or picking up; actual frame rate depends on device performance. This is generated sprite animation rather than a rigged continuous motion capture.

Built-in image generation prompts: (1) same adult anime woman, 16 small sequential walking poses with red rose bouquet physically cradled in the left arm and fingers around stems, same dress/hair/shoes, generous cell margins, fixed scale, 4x4 sheet, transparent or green background; (2) same woman and integrated bouquet in eight standing-to-kneeling poses, left arm supporting roses and free right hand reaching for a letter, fixed scale and complete dress/feet, 4x2 sheet.

`node tests/verify-bouquet.cjs` checks that walking, standing and post-pickup render without a separate bouquet prop and creates previews in output/.

Anatomy correction: the active walking sheet is now `bouquet-walk-fixed.png`. Built-in image editing preserved all 16 leg poses and replaced the erroneous extra swinging arms: exactly two arms lead to two bouquet-holding hands, with no hand behind the hip or next to the thigh. The original sheet is no longer referenced. Rendering timing remains 1.28 seconds per cycle.

Standing-only correction: bouquet-pickup-standing-fixed.png. Built-in imagegen edit prompt: remove the dangling forearm/hand below the bouquet, hold flowers with both hands at the waist, preserve the character and framing. Only frame 0 replaced; the other seven frames are pixel-identical to bouquet-pickup-fixed.png.

