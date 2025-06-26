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
        super().loadImage('img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;
        this.y = 55;
        this.width = 250;
        this.height = 400;
        this.speed = 14;
        this.health = 7;

        this.currentState = 'idle';
        this.isDead = false;
        this.isDeadAnimationPlayed = false;
        this.isHurt = false;

        this.alertPlayed = false;
        this.attackStarted = false;

        this.offset = {
            top: 22,
            right: 22,
            bottom: 22,
            left: 22
        };

        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.isDead) {
                this.playDeathAnimationOnce();
                return;
            }


            if (this.isCharacterNear(600) && this.currentState !== 'hurt' && this.currentState !== 'attack' && this.currentState !== 'chase') {
                setTimeout(() => {
                    this.currentState = 'alert';
                    this.alertPlayed = false;
                    this.attackStarted = false;
                }, 1000);
            }

            switch (this.currentState) {
                case 'alert':
                    this.playAnimation(this.IMAGES_ALERT);

                    if (!this.alertPlayed) {
                        this.alertPlayed = true;

                        this.currentState = 'attack';

                    }
                    break;

                case 'attack':
                    this.playAnimation(this.IMAGES_ATTACK);

                    if (!this.attackStarted) {
                        this.attackStarted = true;
                        setTimeout(() => {
                            this.currentState = 'chase';
                            this.attackStarted = false;
                        }, 1500);
                    }
                    break;

                case 'chase':
                    this.playAnimation(this.IMAGES_WALKING);
                    this.moveTowardCharacter();

                    // Если персонаж убегает дальше 400 пикселей — возвращается в idle
                    if (!this.isCharacterNear(400)) {
                        this.currentState = 'idle';
                    }
                    break;

                case 'hurt':
                    this.playAnimation(this.IMAGES_HURT);
                    setTimeout(() => {
                        if (!this.isDead) {
                            this.currentState = 'attack';
                            this.isHurt = false;
                        }
                    }, 1000 / 60);
                    break;

                default: // idle
                    this.playAnimation(this.IMAGES_WALKING);
                    this.moveLeft();
                    break;
            }
        }, 150);
    }

    moveTowardCharacter() {
        if (!this.world || !this.world.character) return;

        const char = this.world.character;
        if (this.x > char.x) {
            this.moveLeft();
            this.otherDirection = true;
        } else {
            this.moveRight();
            this.otherDirection = false;
        }
    }

    takeDamage() {
        if (this.isDead) return;

        this.health--;
        this.isHurt = true;
        this.currentState = 'hurt';

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.currentState = 'dead';
            sounds.victory_music.play();
        }
    }

    isCharacterNear(distance) {
        if (!this.world || !this.world.character) return false;

        const dx = Math.abs(this.x - this.world.character.x);
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
        }, 2000);
    }

    showGameWonScreen() {
        if (this.world && typeof this.world.showWonScreen === 'function') {
            setTimeout(() => {
                this.world.showWonScreen();
            }, 500);
        }
    }
}
