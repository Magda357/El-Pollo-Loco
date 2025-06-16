let canvas;
let world;
let keyboard = new Keyboard();


function startGame() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    console.log('My Character is', world.character);

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
        case "Throw":
            keyboard.THROW = true;
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
        case "Throw":
            keyboard.THROW = false;
            break;
    }

    console.log(e.code);
});