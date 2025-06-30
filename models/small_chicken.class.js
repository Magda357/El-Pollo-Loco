/**
 * Represents a small chicken enemy that moves left and can be killed.
 * Extends MovableObject for movement and animation capabilities.
 */
class SmallChicken extends MovableObject {

    /** @type {string[]} Paths to images for walking animation */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    /** @type {string[]} Paths to images for dead animation */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /** @type {{top: number, right: number, bottom: number, left: number}} Collision offset values */
    offset = {
        top: 10,
        right: 5,
        bottom: 10,
        left: 10
    };

    /** @type {boolean} Flag indicating whether the chicken is dying */
    isDying = false;

    /**
     * Creates an instance of SmallChicken with randomized initial position and speed.
     * Loads all relevant images and starts animations.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.y = 375;
        this.height = 40;
        this.width = 40;
        this.x = 300 + Math.random() * 2200;
        this.speed = 0.30 + Math.random() * 0.9;
        this.animate();
    }

    /**
     * Starts two animation loops:
     *  - Movement and sound playback at 60 FPS if alive
     *  - Animation frame update every 600 ms depending on energy state
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
        }, 600);
    }

    /**
     * Kills the chicken: sets energy to zero, marks dead, stops movement, and changes image.
     */
    kill() {
        this.energy = 0;
        this.dead = true;
        this.die();
        this.speed = 0;
        this.loadImage('img/3_enemies_chicken/chicken_small/2_dead/dead.png');
    }

    /**
     * Handles death behavior: stops movement and sound playback.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        sounds.chicken_music.pause();
        sounds.chicken_music.currentTime = 0;
    }

    /**
     * Plays the chicken sound effect at a low volume.
     */
    playSound() {
        sounds.chicken_music.volume = 0.1;
        sounds.chicken_music.play();
    }
}
