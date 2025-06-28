let canvas;
let world;
let keyboard = new Keyboard();
let sounds = {
    dead_music: new Audio('audio/dead.mp3'),
    coin_collection: new Audio('audio/coin.mp3'),
    bottle_collection: new Audio('audio/bottle-opening-wine-cork-pop-352701.mp3'),
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

let gameOverTriggered = false;
let isMuted = false;
let muteButton;

window.addEventListener('load', () => {
    muteButton = document.getElementById('mute-button');
    muteButton.addEventListener('click', toggleMute);
});


function toggleMute() {
    isMuted = !isMuted;
    Object.values(sounds).forEach(sound => sound.muted = isMuted);
    muteButton.textContent = isMuted ? '🔇' : '🔊';
}

function startGame() {
    const startScreen = document.getElementById('start-screen');
    canvas = document.getElementById('canvas');

    initLevel();
    initMobileControls();

    startScreen.style.display = 'none';
    canvas.style.display = 'block';

    muteButton.style.display = 'inline-block';

    world = new World(canvas, keyboard);
    gameMusic();


}

function gameMusic() {

    sounds.game_music.volume = 0.2;
    sounds.game_music.loop = true;
    sounds.game_music.play();
}

function gameOver() {
    if (gameOverTriggered) return;
    gameOverTriggered = true;
    muteButton.style.display = 'none';


    sounds.game_music.pause();
    const gameOverScreen = document.getElementById("game-over-screen");
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'block';
}


function win() {

    const gewonnenScreen = document.getElementById("gewonnen-screen");
    muteButton.style.display = 'none';

    canvas.style.display = 'none';
    gewonnenScreen.style.display = 'block';
    setTimeout(() => {
        sounds.victory_music.volume = 0.2;
        sounds.victory_music.loop = false;
        sounds.victory_music.play();

    }, 400);


}

function restartGame() {
    gameOverTriggered = false;
    muteButton.style.display = 'none';


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

    startGame();
}


function checkOrientation() {

    const rotate = document.getElementById('rotate');
    const startButton = document.getElementById('start-button');

    if (rotate && startButton) {
        if (window.innerHeight > window.innerWidth) {
            rotate.style.display = 'flex';
            startButton.disabled = true;
        } else {
            rotate.style.display = 'none';
            startButton.disabled = false;
        }
    }
}

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
            e.preventDefault();
            keyboard[key] = true;
        });

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[key] = false;
        });
    });
}




window.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "ArrowRight":
            keyboard.RIGHT = true;
            break;
        case "ArrowLeft":
            keyboard.LEFT = true;
            break;
        case "ArrowUp":
            keyboard.UP = true;
            break;
        case "ArrowDown":
            keyboard.DOWN = true;
            break;
        case "Space":
            keyboard.SPACE = true;
            break;
        case "KeyD":
            keyboard.D = true;
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "ArrowRight":
            keyboard.RIGHT = false;
            break;
        case "ArrowLeft":
            keyboard.LEFT = false;
            break;
        case "ArrowUp":
            keyboard.UP = false;
            break;
        case "ArrowDown":
            keyboard.DOWN = false;
            break;
        case "Space":
            keyboard.SPACE = false;
            break;
        case "KeyD":
            keyboard.D = false;
            break;
    }
});

