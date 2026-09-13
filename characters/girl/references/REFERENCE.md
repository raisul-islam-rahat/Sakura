# Girl dress and height reference

`dress-reference.webp` is a 1536×1024 lossless transparent visual reference, not an animation sheet. Generated alpha was verified by pixel statistics and compositing against a solid background, then preserved on export without upscaling. The initial tool preview misleadingly displayed a backdrop. No chroma-key background was requested or used. The unified animation sheets now use this design reference.

## Consistent design target

Use the existing walking/standing dress: rose-pink off-shoulder chiffon, fitted waist, small five-petal floral appliques, ruffled sleeves, high-low skirt with a long back train, pink ankle-strap heels, deep plum-brown hair and a pink flower ornament. Front, profile and back views should share the same crown-of-head and shoe-sole baseline. The preview approximates this design; animation views must preserve the same hem construction rather than inventing separate front/back openings.

## Height

Current solo display height is 245 logical game units (`characters/girl/actor.json`, `displayHeight`; `game.js`, `drawGirl`). This is not centimetres and changes in screen pixels with canvas/camera scaling. No real-world height has been specified by the user.

Use 245 logical units as the standing head-to-shoe-sole target, measured independently from flowing hair, raised arms and the dress train. Keep the same source-to-world scale through kneeling and leaning; those poses should become shorter naturally, not be stretched to standing height. All turnaround views must have identical head/body proportions.

The updated solo and couple renderers both request 245 logical units with a 480-pixel source reference. Kneeling and leaning retain fixed scale. Atlas frames include padding around full hair, dress and shoes.

## Generation

Mode: built-in imagegen. Prompt: three full-body views of the same adult anime girl, front/right profile/back, same head and heel baseline and proportions; preserve existing rose-pink off-shoulder high-low chiffon gown, fitted waist, ruffled sleeves, floral appliques, long train, pink ankle-strap heels, plum-brown hair and flower ornament. No bouquet or props, crisp detail, correct limbs, generous padding, real transparent alpha requested. The first generated source was verified to have genuine alpha and selected for lossless WebP export.
