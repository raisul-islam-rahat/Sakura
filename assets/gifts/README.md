# Birthday gifts

Eleven freshly generated high-detail WebP gifts, shown only for challenge letters 5 and 10–19. Letter 20 deliberately has no gift. Direct-open letters have no gift. Completing a challenge opens the diary with a wrapped gift; clicking or keyboard-activating it opens the lid and reveals its image and dedication. Reopening a letter wraps its gift again. Reduced motion skips animation.

Mapping and copy: `letter-gifts.js`. Artwork source manifest and subject prompts: `tools/gift-art-sources.json`. Export: `tools/build-letter-gifts.cjs`. Preview: `output/gift-gallery.png`.

Generated with built-in imagegen. Shared prompt: one exquisite photorealistic romantic birthday gift arrangement; square high-definition macro product photograph, intricate material textures, warm soft cinematic lighting, pale blush/ivory silk, subtle roses and gold bokeh, central framing, no people or hands. Subject prompts in the manifest cover chocolates, white teddy, hair accessories, fantasy mirror, personalized bottle/mug, sunglasses/case, pen/diary, moon pendant, perfume/lipstick, September sapphire necklace/bracelet, and romantic music globe.

Validated with `node tests/verify-letter-gifts.cjs`: challenge completion, every gift mapping, unwrapping, exclusion of direct letters and 20, reopening, reduced motion, and browser errors.
