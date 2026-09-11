# Muno — Sakura Adventure V3

Upload this folder's contents to the root of your GitHub Pages repository. No launcher, Python, npm, or build step is needed. `index.html` must be beside `config.js`, `game.js`, `style.css`, `characters/`, `backgrounds/`, `assets/` and `letters/`.

If you already deployed V2, replace its website files with these. The script/style URLs include a new version query to avoid stale browser copies. Refresh after deployment. Progress is kept only while the current page is open. Reloading or reopening starts a fresh journey. Previous browser saves are removed when the game loads.

## What's changed

- Eight-pose girl walking cycle, with a flowing pink dress.
- One solid pose is rendered at a time. There are no walking cross-fades, doubled limbs or blended torso/leg strips.
- Fixed character scale and per-frame anchor positions reduce apparent jumping between frames.
- An anime adult male character in a white suit, with dedicated walking and cake-carrying poses. All travel uses walking poses and a measured walking speed, including leaving to fetch the cake.
- Separate girl, boy and background folders, each with editable settings.
- Seven different panoramas across a longer journey.
- Layered sakura petal artwork, near/far depth, rotation, perspective flips and wind.
- After the candle blowout and sky transition, the ending plays `video/1.mp4`.

**Resolution:** the seven new panorama sources are **2172 × 724 pixels each**, not native 4K. The image generator returned this size despite requests for 3840 × 1280. They have not been relabeled or enlarged to imply added detail. You can replace them with true 3840 × 1280 images later using the same filenames.

## Main customization folders

| Folder | Contents |
|---|---|
| `characters/girl/` | Girl walking sheet and `actor.json` settings |
| `characters/boy/` | Boy pose sheet, hand-holding artwork and `actor.json` settings |
| `backgrounds/` | Seven numbered panoramas, petal artwork and `backgrounds.json` |
| `letters/01` through `letters/07` | Each letter's message, picture, music, animation and challenge |
| `assets/` | Shared game props, music and minigame artwork |

Each character/background folder includes its own short README.

## Name and entrance

Edit `config.js` for `recipientName`, `nickname`, `secretAnswer`, `senderName`, and the final birthday text. The nickname answer is case-insensitive and ignores surrounding/repeated spaces.

`boyWalkSpeed` controls how fast he travels in the ending. `animationDensity` controls particle quantity: start at `1`; use `0.6` on slower phones. Values above `1` add more particles and cost performance.

The renderer still targets 45 FPS, but actual FPS depends on the device, browser and energy-saving settings. It is not a measured physical-device performance guarantee.

## The seven adventures

| Letter | Gate |
|---|---|
| 01 | Tap the treasure chest a randomized number of times |
| 02 | Catch three rabbits |
| 03 | Connect five stars in order |
| 04 | Match three pairs |
| 05 | Custom question |
| 06 | Custom question |
| 07 | Custom question |

All seven letters must be collected before the final garden is accessible. The bouquet must be picked up at the beginning. The ending retains kneeling, holding hands, sakura rain, the cake, blowing out the candle, the sky transition and your ending video.

## Edit messages, pictures and music

In each numbered letter folder:

- `message.txt`: your message. Save as UTF-8; Bangla, English, emoji and blank lines work.
- `letter.json`: title, photo caption, signature and filenames.
- `picture.webp`: sample picture; replace with your photo and update the filename if its format differs.
- `music.wav`: letter-specific sample soundtrack; replace with an MP3 and update the filename.
- `animation.json`: effect (`hearts`, `stars`, `petals`) and optional GIF/animated WebP file.
- `challenge.json`: minigame settings or question/accepted answers.

Message placeholders: `{{nickname}}`, `{{name}}`, `{{sender}}`.

Example `letter.json`:

```json
{
  "title": "My favourite memory",
  "caption": "That day with you.",
  "text": "message.txt",
  "picture": "us.jpg",
  "music": "our-song.mp3",
  "animation": "animation.json",
  "challenge": "challenge.json",
  "signature": "With love, Pakhi ♡",
  "imageAlt": "Our photograph together"
}
```

Files must be in that same letter folder. Filenames are case-sensitive. Set `picture` or `music` to `null` to omit them. A JPG renamed to `.webp` is not a converted image.

## Your three custom questions

Edit `letters/05/challenge.json`, `letters/06/challenge.json`, and `letters/07/challenge.json`:

```json
{
  "type": "question",
  "title": "A secret only we know",
  "hint": "",
  "question": "Where did we first meet?",
  "answers": ["your answer", "another spelling you accept"],
  "wrongMessage": "Think of that first day. ♡"
}
```

Sample answers remain: 05=`muno`; 06=`rose` or `roses` (also the longer variants in its JSON); 07=`moon`. Replace them before sharing. Case and extra spaces are ignored; other spelling/punctuation must match an accepted answer.

After editing questions during testing, reload the page to start a fresh journey with every gate locked.

This is a client-side romantic game gate, not secure authentication. Public site/repository files expose the messages, photos and answers.

## Validation and remaining limits

JavaScript syntax, asset references, frame bounds and the full game-state sequence are checked. State tests cover incorrect answers, incomplete collection, all four minigames, all three questions, final-garden access, the ending, replay/reset and controls.

This release has not been visually tested in a real mobile browser or benchmarked on a physical phone. The generated poses are not a professionally rigged character animation; fixed scale and anchors address the implementation glitches, but a professional rig remains the best route for completely natural motion.

Test the walking, white outfit, bouquet, question keyboard, music and ending video on the deployed site before sharing it with her.

## Ending video

Place your MP4 in video/1.mp4. Change finale.video in config.js to use another path. The game stops background music, moves the camera to the sky, and attempts video playback. A Play button handles blocked autoplay. The birthday message appears after playback or Continue. The actual video has not yet been supplied.


## Romantic close-up sequence

Hold his hand now zooms in, leads into a 20-pose ballet loop repeated 20 times, then an embrace and kiss. The camera eases back before the boy fetches the cake. Change `finale.danceCycles` or `finale.danceFPS` in config.js to adjust the dance length and speed. The close-up renderer targets 60 FPS; dance art defaults to 8 poses per second.

## Optional challenges and earlier ending

Exactly ten letters currently have challenges: 01, 02, 08, 11, 12, 13, 14, 16, 17, 20. This was randomly selected once and stays fixed. Set `challengeEnabled` to `false` in a letter's `letter.json` to open it after pickup without a challenge; set it to `true` to enable its existing challenge. The challenge files remain available for later editing.

All letters are still required. The boy's arrival triggers roughly four walking steps beyond the last letter (about 403 game units with the current girl animation), rather than at the far end of the panorama. When returning with the cake, he stops 180 game units to the girl's right.

## Seven unique playable gates

01 treasure tapping; 02 catch bunnies; 08 repeat a three-symbol melody; 11 navigate a small maze; 12 connect the constellation; 13 catch a heart in the timing zone; 14 match pairs. Letters 16, 17 and 20 retain their editable question gates. The other ten letters remain challenge-free. New minigames have unlimited retries and keyboard-operable buttons.

Ideas consulted: https://instructions.hasbro.com/en-us/instruction/simon-game-for-kids-ages-8-and-up (remember/repeat patterns), https://www.pbs.org/parents/crafts-and-experiments/explore-spatial-sense-with-june-bug (maze navigation), and https://www.pbs.org/parents/thrive/pbs-kids-games-to-play-together (matching pairs). These are original simplified in-game implementations; no external game code/assets were copied.

The finale now pauses in the close-up embrace for 'Do you love me?'. Each No adds another please; Yes starts the kiss. After blowing out the candle, hold the Cut button (or Space/Enter while focused) for three seconds. Release pauses the cut. The cake separates, then the camera rises and plays video/1.mp4. The bouquet standing/crouching sheet uses bouquet-pickup-fixed.png with two arms per pose.


Current dance: anime-spin-dip-16.png is an 8-column, 2-row sheet. Frames 0–7 spin, frames 8–15 supported dip and recovery; plays once at 4 poses per second. Current gates: questions 5, 10, 18, 19, 20; unique playable games 11–17; other letters open directly. Edit questions/answers in the corresponding letters/NN/challenge.json.


Cosmic birthday journey: backgrounds/cosmic-01.webp through cosmic-07.webp replace the active scenery. Stages are Earth departure, quiet space, crystals, nebula, two Moon approaches, and a lunar sakura garden. All are 2172×724; the walking surface is aligned at y=628. Sky-only pointer/available orientation motion respects reduced-motion settings. Atmospheric particles become sakura only in the final garden.
Twenty wishes cover 27 September 2007 (first birthday) through 27 September 2026 (twentieth birthday), following the requested timeline. Each letter has its own paper palette and a pen-following text reveal. Read the whole letter skips the animation; reduced-motion users see the complete letter immediately. Edit text in letters/NN/message.txt and stationery/reveal behavior in letter-writing.js. The challenge pattern remains questions 5,10,18,19,20 and games11–17.
Validated in headless Edge at a phone viewport: all twenty letters, pen reveal, skip controls, dates, background assets, and no JavaScript errors. Screenshots are in output/.


Seven atmosphere effects follow the girl's scene position: glowing rain, falling stars, crystal flakes, rose hearts, six-armed snowflakes, glowing moon dust/crescents, and sakura petals. Shapes and fall speeds differ, with a 180-world-unit crossfade across boundaries in either direction. The walking path is unaffected. Reduced motion freezes particle movement. Verified with tests/verify-atmospheres.cjs.

