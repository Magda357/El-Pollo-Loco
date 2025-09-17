/**
 * Represents a Chicken enemy in the game.
 * Extends {@link MovableObject} to add movement, animation, and sound.
 */
class Chicken extends MovableObject {

    /** @type {string[]} Image paths for walking animation frames. */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /** @type {string[]} Image paths for dead animation frame. */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Collision box offset for the chicken.
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = {
        top: 10,
        right: 5,
        bottom: 10,
        left: 10
    };

    /** @type {boolean} Flag indicating if the chicken is in the process of dying. */
    isDying = false;

    /**
     * Creates a new Chicken instance.
     * Randomizes initial x position and speed.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.y = 360;
        this.height = 60;
        this.width = 80;

        this.x = 300 + Math.random() * 2200;
        this.speed = 0.15 + Math.random() * 0.5;

        this.animate();
    }

    /**
     * Starts intervals to handle movement and animation.
     * Moves left and plays walking animation while alive,
     * switches to dead animation when energy is depleted.
     */
    animate() {
        setInterval(() => {
            if (this.energy > 0) {
                this.moveLeft();
                this.playSound();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.energy > 0) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_DEAD);
            }
        }, 400);
    }

    /**
     * Called when the chicken is hit.
     * Sets energy and speed to zero and plays dead animation.
     */
    hit() {
        this.energy = 0;
        this.speed = 0;
        this.playAnimation(this.IMAGES_DEAD);
    }

    /**
     * Fully kills the chicken, marking it as dead and showing dead image.
     */
    kill() {
        this.energy = 0;
        this.dead = true;
        this.speed = 0;
        this.die();
        this.loadImage('img/3_enemies_chicken/chicken_normal/2_dead/dead.png');
    }

    /**
     * Marks chicken as dead and stops its movement and sound.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        sounds.chicken_music.pause();
        sounds.chicken_music.currentTime = 0;
    }

    /**
     * Plays chicken walking sound at low volume.
     */
    playSound() {
        sounds.chicken_music.volume = 0.1;
        sounds.victory_music.loop = false;
        sounds.chicken_music.play();
    }
}
