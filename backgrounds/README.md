# Background customization

`01.webp` through `07.webp` are the seven panoramas in travel order.
`backgrounds.json` lists their filenames and the overlap between adjacent scenes.
`petals.webp` contains six individual sakura petals; its frame data is in backgrounds.json.

To change scenery, replace a numbered file using the same filename, or change its `file` entry in backgrounds.json. Keep a3:1 landscape ratio and a horizontal walkable path at about86.7% of the image height. The renderer lays the panoramas out once, in order, with overlapping edges; it does not loop them.

The supplied images are native2172×724 pixels, not4K. True3840×1280 replacements are supported. The `nativeWidth`/`nativeHeight` fields document the supplied source size; update them if you replace the files. They do not control the rendered scale.

For each file, `segmentWidth` is3000 world units and `overlap` is200. Keep these defaults unless you want to change travel distances and transition widths. The world length and letter spacing adapt to the panorama count.

Petal number is controlled by animationDensity in config.js. Near petals are larger and move differently from distant petals. Reduced-motion settings lower density and movement.
