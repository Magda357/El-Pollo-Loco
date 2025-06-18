let canvas;
let world;
let keyboard = new Keyboard();


function startGame() {
    const startScreen = document.getElementById('start-screen');
    canvas = document.getElementById('canvas');

    //start screen hidden und canvas zeigen
    startScreen.style.display = 'none';
    canvas.style.display = 'block';

    world = new World(canvas, keyboard);

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

    console.log(e.code);
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

