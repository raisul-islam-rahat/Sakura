# Bouquet walk v2

Mode: built-in imagegen, reference-guided generation. Source: exec-1781c93d-c083-4cd3-b3fc-bae63911f8a7.png. The first candidate exec-e79243ad-6398-454f-a14c-3998dbbc18f4.png was rejected for no alpha and repeated gait.

Prompt specification: eight separate full-body walking poses in a 4x2 grid, same adult anime girl from dress-reference-preview.png; plum hair, pink flower, rose-pink high-low ruffled dress, long train and pink heels; red roses held with both hands near chest. Rightward natural walk with alternating planted, lift, passing and contact poses; coherent knees, ankles and two visible shoes; short steps, no fused or extra limbs. Fixed head/body size, generous transparent gutters, complete train and feet. Crisp contours with no halo or white border. Actual RGBA transparency required, no painted checkerboard, matte or ground shadow.

Verification before integration: source has native alpha; every cropped pose has complete visible bounds; lossless WebP has alpha and 81.8% fully transparent pixels; final sheet inspected on dark and light backgrounds. Export contains no background-removal pass. Gameplay bouquet and pickup checks passed.
