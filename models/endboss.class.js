class Endboss extends MovableObject {
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;
        this.y = 55;
        this.width = 250;
        this.height = 400;
        this.speed = 20;
        this.health = 7;

        this.currentState = 'idle';
        this.isDead = false;
        this.isDeadAnimationPlayed = false;
        this.isHurt = false;
        this.alertPlayed = false;
        this.attackStarted = false;

        this.offset = { top: 22, right: 22, bottom: 22, left: 22 };

        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.isDead) {
                this.playDeathAnimationOnce();
                this.die();
                return;
            }

            if (this.isHurt) {
                this.currentState = 'hurt';
                this.playAnimation(this.IMAGES_HURT);

                setTimeout(() => {
                    this.isHurt = false;
                    if (!this.isDead) {
                        this.currentState = 'attack';
                    }
                }, 500);
                return;
            }

            const near400 = this.isCharacterNear(400);
            const near900 = this.isCharacterNear(900);

            if (this.currentState === 'idle') {
                if (near400) {
                    this.currentState = 'alert';
                    this.alertPlayed = false;
                } else {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            } else if (this.currentState === 'alert') {
                this.playAnimation(this.IMAGES_ALERT);
                if (!this.alertPlayed) {
                    this.alertPlayed = true;
                    setTimeout(() => {
                        this.currentState = 'attack';
                    }, 700);
                }
            } else if (this.currentState === 'attack') {
                this.playAnimation(this.IMAGES_ATTACK);
                if (!this.attackStarted) {
                    this.attackStarted = true;
                    this.playSound();
                    setTimeout(() => {
                        this.currentState = 'chase';
                        this.attackStarted = false;
                    }, 1000);
                }
            } else if (this.currentState === 'chase') {
                if (near900) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.moveTowardCharacter();
                } else {
                    this.currentState = 'idle';
                }
            }
        }, 150);
    }

    die() {
        this.isDead = true;
        this.speed = 0;
        sounds.endboss_music.pause();
        sounds.endboss_music.currentTime = 0;
    }
    playSound() {
        sounds.endboss_music.volume = 0.8;
        sounds.endboss_music.play();
    }

    moveTowardCharacter() {
        if (!world || !world.character) return;

        const char = world.character;
        const dx = this.x - char.x;

        if (Math.abs(dx) > 20) {
            if (dx > 0) {
                this.moveLeft();
                this.otherDirection = false;
            } else {
                this.moveRight();
                this.otherDirection = true;
            }
        }
    }

    takeDamage() {
        if (this.isDead) return;

        this.health--;
        this.isHurt = true;

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.currentState = 'dead';
            sounds.victory_music.play();
        }
    }

    isCharacterNear(distance) {
        if (!world || !world.character) return false;
        const dx = Math.abs(this.x - world.character.x);
        return dx < distance;
    }

    playDeathAnimationOnce() {
        if (this.isDeadAnimationPlayed) return;

        this.playAnimation(this.IMAGES_DEAD);
        this.isDeadAnimationPlayed = true;


        setTimeout(() => {
            this.y = -1000;
            this.speed = 0;
            win();
        }, 1000);
    }
}