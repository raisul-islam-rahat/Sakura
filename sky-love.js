(() => {
    const el = document.createElement('div');

    el.id = 'sky-love-line';
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');

    const app = document.getElementById('app');

    if (!app) {
        console.warn('Sky Love: #app element not found');
        return;
    }

    app.append(el);

    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    let lines = [];
    let lineIndex = 0;

    let showing = false;
    let age = 0;
    let wait = 2;

    let sparkleTimer = 0;
    let nextSparkleIn = 0.12;

    fetch('sky-love-lines.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Love lines could not load');
            }

            return response.text();
        })
        .then(text => {
            lines = text
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean);
        })
        .catch(error => {
            console.warn(error.message);
        });


    function nextLine() {
        if (!lines.length) return '';

        const line = lines[lineIndex];

        lineIndex = (lineIndex + 1) % lines.length;

        return line;
    }


    function createLine(text) {
        const fragment = document.createDocumentFragment();

        const words = text.split(' ');

        words.forEach((word, wordIndex) => {
            if (wordIndex > 0) {
                fragment.append(
                    document.createTextNode(' ')
                );
            }

            const wordEl = document.createElement('span');

            wordEl.className = 'sky-word';

            [...word].forEach(char => {
                const letter = document.createElement('span');

                letter.className = 'sky-letter';
                letter.textContent = char;

                wordEl.append(letter);
            });

            fragment.append(wordEl);
        });

        el.replaceChildren(fragment);
    }


    function sparkleLetter(letter) {
        if (!letter) return;

        if (letter.classList.contains('sparkle')) {
            return;
        }

        letter.classList.add('sparkle');

        const duration =
            220 + Math.random() * 280;

        window.setTimeout(() => {
            letter.classList.remove('sparkle');
        }, duration);
    }


    function createRandomSparkle() {
        if (!showing || el.hidden) return;

        const letters =
            el.querySelectorAll('.sky-letter');

        if (!letters.length) return;

        /*
            Usually sparkle one letter.
            Sometimes two at the same time.
        */
        const sparkleCount =
            Math.random() < 0.22 ? 2 : 1;

        for (let i = 0; i < sparkleCount; i++) {
            const index =
                Math.floor(
                    Math.random() * letters.length
                );

            sparkleLetter(letters[index]);
        }
    }


    function showLine() {
        const text = nextLine();

        if (!text) return;

        createLine(text);

        el.style.top =
            `${13 + Math.random() * 8}%`;

        el.style.left =
            `${35 + Math.random() * 30}%`;

        el.hidden = false;

        el.classList.remove(
            'sky-show',
            'sky-show-static'
        );

        /*
            Restart the line animation.
            This happens only once per sentence,
            not every frame.
        */
        void el.offsetWidth;

        if (reduceMotion) {
            el.classList.add('sky-show-static');
        } else {
            el.classList.add('sky-show');
        }

        showing = true;
        age = 0;

        sparkleTimer = 0;
        nextSparkleIn =
            0.08 + Math.random() * 0.14;
    }


    function hideLine() {
        showing = false;

        el.hidden = true;

        el.classList.remove(
            'sky-show',
            'sky-show-static'
        );

        /*
            Remove active sparkle classes
            before the next sentence.
        */
        el.querySelectorAll('.sparkle')
            .forEach(letter => {
                letter.classList.remove('sparkle');
            });

        wait =
            3 + Math.random() * 3;
    }


    /*
        Call this from your existing game loop.

        dt should be in seconds.
        Example:
        updateSkyLove(deltaTime, true);
    */

    window.updateSkyLove = (dt, visible) => {
        if (!visible || !lines.length) {
            el.hidden = true;
            return;
        }

        if (!showing) {
            wait -= dt;

            if (wait <= 0) {
                showLine();
            }

            return;
        }

        age += dt;

        /*
            Random letter glitter.
            No setInterval.
            Uses your existing game loop,
            which is cleaner for your site.
        */

        sparkleTimer += dt;

        if (sparkleTimer >= nextSparkleIn) {
            sparkleTimer = 0;

            createRandomSparkle();

            nextSparkleIn =
                0.09 + Math.random() * 0.18;
        }

        /*
            Line stays visible for 7 seconds.
        */
        if (age >= 7) {
            hideLine();
        }
    };
})();