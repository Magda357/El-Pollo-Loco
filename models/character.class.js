class Character extends MovableObject {


    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

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

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'

    ];

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


    world;
    bottlesCollected = 0;
    coinsCollected = 0;
    lastHitTime = 0;
    invulnerabilityDuration = 1000;
    otherDirection = false;



    offset = {
        top: 100,
        right: 25,
        bottom: 10,
        left: 20
    };


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

    animate() {
        this.moveInterval();
        this.animateInterval();
    }

    moveInterval() {

        setInterval(() => {
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

            this.world.camera_x = -this.x + 100;

        }, 1000 / 60);
    }



    animateInterval() {
        setInterval(() => {

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                setTimeout(() => gameOver(), 1000);


            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);

            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
                this.playsound1();


            } else {
                let timeSinceLastAction = new Date().getTime() - this.lastActionTime;

                if (timeSinceLastAction > 10000) {

                    this.playAnimation(this.IMAGES_SLEEPING);
                    sounds.sleep_music.volume = 0.2;


                } else if (this.world.keyboard.RIGHT ||
                    this.world.keyboard.LEFT ||
                    this.world.keyboard.D ||
                    this.world.keyboard.SPACE) {
                    this.playAnimation(this.IMAGES_WALKING);

                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                }
            }
        }, 100);
    }


    jump() {
        this.speedY = 30;
    }

    playsound() {
        sounds.hurt_music.volume = 0.2;
        sounds.hurt_music.play();
    }
    playsound1() {

        sounds.jumping_music = 0.5;
        sounds.jumping_music.play();
    }
}


