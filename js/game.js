/**
 * The HTML canvas element used for rendering the game.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The main game world instance.
 * @type {World}
 */
let world;

/**
 * Object representing the current state of the keyboard inputs.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Collection of all game-related sound effects and background music.
 * @type {Object.<string, HTMLAudioElement>}
 */
let sounds = {
    dead_music: new Audio('audio/dead.mp3'),
    coin_collection: new Audio('audio/coin.mp3'),
    bottle_collection: new Audio('audio/bottle-opening-wine-cork-pop-352701.mp3'),
    bottle_collection2: new Audio('audio/collect_bottle.mp3'),
    game_music: new Audio('audio/theme-song.mp3'),
    hurt_music: new Audio('audio/hurt.mp3'),
    jumping_music: new Audio('audio/jumping.mp3'),
    running_music: new Audio('audio/running.mp3'),
    throwing_music: new Audio('audio/audio_throw.mp3'),
    sleep_music: new Audio('audio/sleeping.mp3'),
    victory_music: new Audio('audio/goodresult-82807.mp3'),
    endboss_music: new Audio('audio/chicken-cluking-type-3-293320.mp3'),
    chicken_music: new Audio('audio/short-chick-sound-171389.mp3')
};

/**
 * Indicates whether the game-over logic has already been triggered.
 * @type {boolean}
 */
let gameOverTriggered = false;


document.addEventListener('DOMContentLoaded', () => {
    const showImpressumBtn = document.getElementById('showImpressumBtn');
    const impressumModal = document.getElementById('impressumModal');
    const closeImpressumBtn = document.getElementById('closeImpressumBtn');


    showImpressumBtn.addEventListener('click', () => {
        impressumModal.classList.add('show');
    });
    closeImpressumBtn.addEventListener('click', () => {
        impressumModal.classList.remove('show');
    });
    impressumModal.addEventListener('click', (e) => {
        if (e.target === impressumModal) {
            impressumModal.classList.remove('show');
        }
    });
});

/**
 * Initializes the game, canvas, level, and world objects.
 */
function startGame() {
    if (window.innerHeight > window.innerWidth) {
        return;
    }

    document.getElementById('start-button').style.display = 'none';
    document.getElementById('showImpressumBtn').style.display = 'flex';
    canvas = document.getElementById('canvas');
    initLevel();
    initMobileControls();
    document.getElementById('start-screen').style.display = 'none';
    canvas.style.display = 'block';
    world = new World(canvas, keyboard);
    gameMusic();
    showTouchButtons();


    // Klick-Erkennung für das Mute-Icon im Canvas
    canvas.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        // Prüfe, ob auf das Icon geklickt wurde
        if (x > canvas.width - 60 && x < canvas.width - 20 && y > 20 && y < 60) {
            world.isMuted = !world.isMuted;
            Object.values(sounds).forEach(sound => {
                sound.muted = world.isMuted;
            });
        }

        // Fullscreen-Icon (rechts oben, links vom Mute)
        if (x > canvas.width - 120 && x < canvas.width - 80 && y > 20 && y < 60) {
            const fullscreenContainer = document.getElementById('fullscreen');
            if (!document.fullscreenElement) {
                if (fullscreenContainer.requestFullscreen) {
                    fullscreenContainer.requestFullscreen();
                } else if (fullscreenContainer.webkitRequestFullscreen) {
                    fullscreenContainer.webkitRequestFullscreen();
                } else if (fullscreenContainer.msRequestFullscreen) {
                    fullscreenContainer.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
    });


}

function showTouchButtons() {
    document.getElementById('fullscreen').classList.add('game-active');
}

function hideTouchButtons() {
    document.getElementById('fullscreen').classList.remove('game-active');
}

/**
  *   Plays the main background music in a loop.
 */
function gameMusic() {
    sounds.game_music.volume = 0.2;
    sounds.game_music.loop = true;
    sounds.game_music.play();
}

/**
 * Displays the game-over screen and stops all gameplay.
 */
function gameOver() {
    if (gameOverTriggered) return;
    gameOverTriggered = true;
    const gameOverScreen = document.getElementById("game-over-screen");
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'block';
    hideTouchButtons();
    stopAllSounds();
}

function victoryMusic() {
    // Stoppe alle anderen Sounds
    for (let key in sounds) {
        if (key !== 'victory_music') {
            sounds[key].pause();
            sounds[key].currentTime = 0;
            sounds[key].muted = true;
        }
    }
    sounds.victory_music.volume = 0.2;
    sounds.victory_music.loop = false;
    sounds.victory_music.play();
}
/**
 * Displays the win screen and plays a victory sound.
 */
function win() {
    hideTouchButtons();
    const gewonnenScreen = document.getElementById("gewonnen-screen");
    canvas.style.display = 'none';
    gewonnenScreen.style.display = 'block';
    sounds.game_music.pause();
    hideTouchButtons();
    setTimeout(() => {
        victoryMusic();
    }, 400);

}

/**
 * Restarts the game from the beginning by resetting all states.
 */
function restartGame() {
    gameOverTriggered = false;
    sounds.dead_music.pause();
    sounds.dead_music.currentTime = 0;

    if (world) {
        world.clearWorld();
        world = null;
    }

    Object.values(sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('gewonnen-screen').style.display = 'none';
    const canvas = document.getElementById('canvas');
    canvas.style.display = 'block';
    showTouchButtons();
    startGame();

}

/**
 * Checks the current device orientation and disables the game if in portrait mode.
 */
function checkOrientation() {
    const rotate = document.getElementById('rotate');
    const startButton = document.getElementById('start-button');
    const canvas = document.getElementById('canvas');
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait) {
        rotate.style.display = 'flex';
        if (startButton) startButton.disabled = true;
    } else {
        rotate.style.display = 'none';
        if (startButton) startButton.disabled = false;
    }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('load', checkOrientation);



/**
 * Sets up touch input controls for mobile gameplay.
 */
function initMobileControls() {
    const map = {
        'btn-left': 'LEFT',
        'btn-right': 'RIGHT',
        'btn-jump': 'SPACE',
        'btn-throw': 'D'
    };

    Object.entries(map).forEach(([btnId, key]) => {
        const btn = document.getElementById(btnId);

        btn.addEventListener('touchstart', (e) => {
            keyboard[key] = true;
        }, { passive: true });

        btn.addEventListener('touchend', (e) => {
            keyboard[key] = false;
        }, { passive: true });
    });
}

/**
 * Updates key state when a key is pressed.
 * @param {KeyboardEvent} e - The keyboard event.
 */
window.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "ArrowRight": keyboard.RIGHT = true; break;
        case "ArrowLeft": keyboard.LEFT = true; break;
        case "ArrowUp": keyboard.UP = true; break;
        case "ArrowDown": keyboard.DOWN = true; break;
        case "Space": keyboard.SPACE = true; break;
        case "KeyD": keyboard.D = true; break;
    }
});

/**
 * Updates key state when a key is released.
 * @param {KeyboardEvent} e - The keyboard event.
 */
window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "ArrowRight": keyboard.RIGHT = false; break;
        case "ArrowLeft": keyboard.LEFT = false; break;
        case "ArrowUp": keyboard.UP = false; break;
        case "ArrowDown": keyboard.DOWN = false; break;
        case "Space": keyboard.SPACE = false; break;
        case "KeyD": keyboard.D = false; break;
    }
});

/**
 * Waits for the window to fully load before executing the code.
 */
window.addEventListener('load', () => {
    /**
     * @type {HTMLElement} The modal element for the Impressum (legal notice).
     */
    const impressumModal = document.getElementById('impressumModal');
    /**
     * @type {HTMLElement} The button that opens the Impressum modal.
     */
    const showBtn = document.getElementById('showImpressumBtn');
    /**
     * @type {HTMLElement} The button that closes the Impressum modal.
     */
    const closeBtn = document.getElementById('closeImpressumBtn');
    /**
     * Adds the 'show' class to the Impressum modal to display it.
     */
    showBtn.addEventListener('click', () => {
        impressumModal.classList.add('show');
    });

    /**
     * Removes the 'show' class from the Impressum modal to hide it.
     */
    closeBtn.addEventListener('click', () => {
        impressumModal.classList.remove('show');
    });
    /**
     * Hides the Impressum modal when clicking outside the modal content area.
     *
     * @param {MouseEvent} e - The mouse click event.
     */
    impressumModal.addEventListener('click', (e) => {
        if (e.target === impressumModal) {
            impressumModal.classList.remove('show');
        }
    });
});