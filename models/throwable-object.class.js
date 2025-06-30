/**
 * Represents a throwable object that can be thrown, rotated, and splashed.
 * Extends MovableObject to handle movement and gravity.
 */
class ThrowableObject extends MovableObject {

    /** 
     * @type {string[]} Array of image paths for the rotation animation frames 
     */
    IMAGES_ROTATION = [
        './img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /** 
     * @type {string[]} Array of image paths for the splash animation frames 
     */
    IMAGES_SPLASH = [
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * @type {Object} Collision offsets for each side of the object
     * @property {number} top - Top offset
     * @property {number} right - Right offset
     * @property {number} bottom - Bottom offset
     * @property {number} left - Left offset
     */
    offset = {
        top: 10,
        right: 0,
        bottom: 5,
        left: 10
    };

    /** @type {boolean} Flag indicating whether the bottle has splashed */
    isSplashed = false;

    /**
     * Creates a throwable object at specified position and direction.
     * @param {number} x - Initial x-position
     * @param {number} y - Initial y-position
     * @param {boolean} otherDirection - If true, object is thrown to the left
     */
    constructor(x, y, otherDirection) {
        super().loadImage('./img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 50;
        this.width = 60;
        this.otherDirection = otherDirection;
        this.throw();
    }

    /**
     * Starts the throwing process: applies physics, movement, animation, and sound.
     */
    throw() {
        this.applyThrowPhysics();
        this.startThrowDirectionLoop();
        this.startRotationAnimation();
        this.playThrowingSound();
        this.startForwardMovement();
    }

    /**
     * Applies gravity and initial speeds for throwing physics.
     */
    applyThrowPhysics() {
        this.applyGravity();
        this.speedY = 20;
        this.speedX = 10;
    }

    /**
     * Starts the movement interval that updates position based on throw direction.
     */
    startThrowDirectionLoop() {
        const fn = this.otherDirection
            ? this.throwToTheLeft.bind(this)
            : this.throwToTheRight.bind(this);

        this.throwInterval = setInterval(() => {
            fn();
        }, 1000 / 25);
    }

    /**
     * Starts the rotation animation interval.
     */
    startRotationAnimation() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 1000 / 20);
    }

    /**
     * Starts interval that moves the object forward while not splashed.
     */
    startForwardMovement() {
        this.forwardInterval = setInterval(() => {
            if (!this.isSplashed) {
                this.x += 5;
            }
        }, 25);
    }

    /**
     * Moves the object to the right, playing rotation animation.
     * @returns {void}
     */
    throwToTheRight() {
        if (this.x < 3000) {
            this.x += this.speedX;
            this.playAnimation(this.IMAGES_ROTATION);
        }
    }

    /**
     * Moves the object to the left, playing rotation animation.
     * @returns {void}
     */
    throwToTheLeft() {
        if (this.x > -2000) {
            this.x -= this.speedX;
            this.playAnimation(this.IMAGES_ROTATION);
        }
    }

    /**
     * Starts the splash animation and removes the object from the world when done.
     */
    splash() {
        this.isSplashed = true;

        let currentFrame = 0;
        let splashInterval = setInterval(() => {
            if (currentFrame < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[currentFrame]];
                currentFrame++;
            } else {
                clearInterval(splashInterval);

                if (this.world) {
                    const index = this.world.throwableObjects.indexOf(this);
                    if (index > -1) {
                        this.world.throwableObjects.splice(index, 1);
                    }
                }
            }
        }, 20);
    }

    /**
     * Plays the sound effect for throwing the object.
     */
    playThrowingSound() {
        sounds.throwing_music.volume = 0.8;
        sounds.throwing_music.currentTime = 0;
        sounds.throwing_music.play();
    }
}
