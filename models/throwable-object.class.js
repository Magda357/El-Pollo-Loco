class ThrowableObject extends MovableObject {

    IMAGES_ROTATION = [
        './img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_SPLASH = [
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    offset = {
        top: 10,
        right: 0,
        bottom: 5,
        left: 10
    };

    isSplashed = false;

    constructor(x, y, otherDirection) {
        super().loadImage('./img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.throw();
    }


    throw() {
        this.applyGravity();
        this.speedY = 20;
        this.speedX = 10;

        if (this.otherDirection) {
            this.throwInterval = setInterval(() => {
                this.throwToTheLeft();
            }, 1000 / 25);
        } else {
            this.throwInterval = setInterval(() => {
                this.throwToTheRight();
            }, 1000 / 25);
        }

        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 1000 / 20);

        this.playThrowingSound();

        setInterval(() => {
            if (!this.isSplashed) {
                this.x += 5;
            }
        }, 25);
    }

    throwToTheRight() {
        if (this.x < 3000) {
            this.x += this.speedX;
            this.playAnimation(this.IMAGES_ROTATION);
        }
    }

    throwToTheLeft() {
        if (this.x > -2000) {
            this.x -= this.speedX;
            this.playAnimation(this.IMAGES_ROTATION);

        }
    }

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
        }, 1000);
    }


    playThrowingSound() {
        sounds.throwing_music.volume = 0.2;
        sounds.throwing_music.currentTime = 0;
        sounds.throwing_music.play();
    }

}

