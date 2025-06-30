/**
 * Represents the main playable character in the game.
 * Extends {@link MovableObject} to include movement, animations, and sound effects.
 */
class Character extends MovableObject {

    /** @type {string[]} Image paths for walking animation frames. */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /** @type {string[]} Image paths for jumping animation frames. */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    /** @type {string[]} Image paths for death animation frames. */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    /** @type {string[]} Image paths for hurt animation frames. */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /** @type {string[]} Image paths for sleeping animation frames. */
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /** @type {string[]} Image paths for idle animation frames. */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /** @type {World} Reference to the game world the character is in. */
    world;

    /** @type {number} Number of bottles collected by the character. */
    bottlesCollected = 0;

    /** @type {number} Number of coins collected by the character. */
    coinsCollected = 0;

    /** @type {number} Timestamp of the last time the character was hit. */
    lastHitTime = 0;

    /** @type {number} Duration (in milliseconds) the character remains invulnerable after being hit. */
    invulnerabilityDuration = 1000;

    /** @type {boolean} Indicates if the character is facing the opposite direction. */
    otherDirection = false;

    /** @type {number|null} ID of the interval handling character movement. */
    moveIntervalId = null;

    /** @type {number|null} ID of the interval handling character animation. */
    animateIntervalId = null;

    /**
     * Collision box offset to fine-tune collision detection.
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = {
        top: 100,
        right: 25,
        bottom: 10,
        left: 20
    };

    /**
     * Creates a new Character instance, initializes images, position, speed and gravity.
     */
    constructor() {
        super().loadImage('./img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_IDLE);

        this.height = 250;
        this.y = 80;
        this.speed = 10;

        this.applyGravity();
        this.animate();
    }

    /**
     * Starts movement and animation intervals for the character.
     */
    animate() {
        this.moveInterval();
        this.animateInterval();
    }

    /**
     * Creates an interval that checks for keyboard input and moves the character accordingly.
     */
    moveInterval() {
        this.moveIntervalId = setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                this.lastActionTime = new Date().getTime();
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                this.lastActionTime = new Date().getTime();
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.lastActionTime = new Date().getTime();
            }

            if (this.world) {
                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);
    }

    /**
     * Creates an interval that updates the character animation based on its state.
     */
    animateInterval() {
        this.animateIntervalId = setInterval(() => {
            if (this.handleDeath()) return;
            if (this.handleHurt()) return;
            if (this.handleJump()) return;
            if (this.handleSleep()) return;
            if (this.handleMovement()) return;

            this.playIdle();
        }, 100);
    }

    /**
     * Handles death animation and sound.
     * @returns {boolean} True if character is dead and animation played, else false.
     */
    handleDeath() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.playSound_die();
            gameOver();
            this.stopAllSounds();
            return true;
        }
        return false;
    }

    /**
     * Handles hurt animation and sound.
     * @returns {boolean} True if character is hurt and animation played, else false.
     */
    handleHurt() {
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.playSound_hurt();
            return true;
        }
        return false;
    }

    /**
     * Handles jump animation and sound.
     * @returns {boolean} True if character is jumping and animation played, else false.
     */
    handleJump() {
        if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
            this.playSound_jump();
            return true;
        }
        return false;
    }

    /**
     * Handles sleeping animation and sound when idle for a long time.
     * @returns {boolean} True if character is sleeping, else false.
     */
    handleSleep() {
        let timeSinceLastAction = new Date().getTime() - this.lastActionTime;
        if (timeSinceLastAction > 10000) {
            this.playAnimation(this.IMAGES_SLEEPING);
            this.playSound_sleep();
            return true;
        }
        return false;
    }

    /**
     * Handles walking/running animation and sound.
     * @returns {boolean} True if character is moving, else false.
     */
    handleMovement() {
        if (this.world.keyboard.RIGHT ||
            this.world.keyboard.LEFT ||
            this.world.keyboard.D ||
            this.world.keyboard.SPACE) {
            this.playAnimation(this.IMAGES_WALKING);
            this.playSound_running();
            return true;
        }
        return false;
    }

    /**
     * Plays idle animation.
     */
    playIdle() {
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Clears intervals for movement and animation.
     */
    clearCharacterIntervals() {
        if (this.moveIntervalId) clearInterval(this.moveIntervalId);
        if (this.animateIntervalId) clearInterval(this.animateIntervalId);
    }

    /**
     * Makes the character jump by setting vertical speed.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Sets the character as dead, stops movement, and pauses death music.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        sounds.dead_music.pause();
        sounds.dead_music.currentTime = 0;
    }

    /** Plays death sound effect. */
    playSound_die() {
        sounds.dead_music.volume = 0.8;
        sounds.dead_music.play();
    }

    /** Plays hurt sound effect. */
    playSound_hurt() {
        sounds.hurt_music.volume = 0.6;
        sounds.hurt_music.play();
    }

    /** Plays jump sound effect. */
    playSound_jump() {
        sounds.jumping_music.volume = 0.9;
        sounds.jumping_music.play();
    }

    /** Plays running sound effect. */
    playSound_running() {
        sounds.running_music.volume = 0.8;
        sounds.running_music.play();
    }

    /** Plays sleep sound effect. */
    playSound_sleep() {
        sounds.sleep_music.volume = 0.4;
        sounds.running_music.play();
    }

    /**
     * Stops all currently playing sounds.
     */
    stopAllSounds() {
        for (let i in sounds) {
            sounds[i].pause();
            sounds[i].currentTime = 0;
        }
    }
}
