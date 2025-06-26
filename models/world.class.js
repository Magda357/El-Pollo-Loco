class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    throwableObject = [];
    MAX_BOTTLES = 10;
    MAX_COINS = 10;
    canThrow = true;
    throwCooldown = 500;
    health = 7;
    maxStatusTimeout;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.endbossStatusbarCreated = false;
        this.statusBarEndboss = null;
        this.endbossActivated = false;
        this.setWorld();
        this.run();
        this.endboss = this.level.enemies.find(e => e instanceof Endboss);
        this.level.endboss = this.endboss;
        this.fullscreenIcon = new Image();
        this.fullscreenIcon.src = 'img/instruction-bild/icons8-vollbild-48.png';


        this.iconX = this.canvas.width - 60;
        this.iconY = 10;
        this.iconWidth = 48;
        this.iconHeight = 48;


        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            const clickedFullscreenIcon =
                clickX >= this.iconX &&
                clickX <= this.iconX + this.iconWidth &&
                clickY >= this.iconY &&
                clickY <= this.iconY + this.iconHeight;

            if (clickedFullscreenIcon) {
                if (document.fullscreenElement === this.canvas) {
                    console.log('Exiting fullscreen...');
                    this.exitFullscreen();
                } else {
                    console.log('Entering fullscreen...');
                    this.enterFullscreen(this.canvas);
                }
            }
        });
        this.draw();
    }


    fullscreen() {
        let fullscreen = document.getElementById('fullscreen');
        this.enterFullscreen(fullscreen);

    }

    enterFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {      // for IE11 (remove June 15, 2022)
            element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {  // iOS Safari
            element.webkitRequestFullscreen();
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    setWorld() {
        this.character.world = this;
        if (this.level.endboss) {
            this.level.endboss.world = this;  //  nur wenn endboss existiert
        }
    }
    startEnemyAnimation() {
        this.level.enemies.forEach(enemy => {
            if (enemy.animate) {
                enemy.animate();
            }
        });
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 20);

        setInterval(() => {
            this.checkThrowObjects();
        }, 10);

        setInterval(() => {
            this.checkBottleHitsEnemies();
        }, 5);

        setInterval(() => {
            this.activateEndboss();
        }, 200);
    }

    activateEndboss() {
        let endboss = this.level.endboss;
        if (!endboss || !this.character) return;

        let distance = endboss.x - (this.character.x + this.character.width);

        if (distance <= 300 && !this.endbossActivated) {
            this.endbossActivated = true;
            this.statusBarEndboss = new StatusBarEndboss();
            this.endbossStatusbarCreated = true;

            endboss.currentState = 'alert';
            console.log('Endboss alert state activated!');
        }
    }

    createEndbossStatusbar() {
        if (this.isCharacterNearEndboss() && !this.endbossStatusbarCreated) {
            this.statusBarEndboss = new StatusBarEndboss();
            this.endbossStatusbarCreated = true;
        }
    }





    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottlesCollected > 0 && this.canThrow) {
            let bottle = new ThrowableObject(
                this.character.x + 80,
                this.character.y + 40,
                this.character.otherDirection);
            this.throwableObject.push(bottle);
            this.character.bottlesCollected--;
            this.statusBarBottle.setPercentage((this.character.bottlesCollected / this.MAX_BOTTLES) * 100);
            this.canThrow = false;
            setTimeout(() => {
                this.canThrow = true;
            }, this.throwCooldown);
        }
    }

    checkCollisions() {

        this.checkCollisionEnemies();
        this.bottleCounter();
        this.coinCounter();

        let bottles = Math.min(this.character.bottlesCollected, this.MAX_BOTTLES);
        this.statusBarBottle.setPercentage((bottles / this.MAX_BOTTLES) * 100);

        let coins = Math.min(this.character.coinsCollected, this.MAX_COINS);
        this.statusBarCoin.setPercentage((coins / this.MAX_COINS) * 100);

        if (bottles === this.MAX_BOTTLES && coins === this.MAX_COINS) {
            this.showMaxStatusEffect();

        }

    }

    checkBottleHitsEnemies() {
        this.throwableObject.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding(enemy)) {
                    if (!(enemy instanceof Endboss)) {
                        if (enemy.kill) enemy.kill();
                        setTimeout(() => {
                            this.level.enemies.splice(enemyIndex, 1);
                            this.throwableObject.splice(bottleIndex, 1);
                            this.playAnimation(bottle);
                        }, 220);
                    } else {
                        //  Endboss
                        if (!enemy.isDead) {
                            enemy.takeDamage();
                            this.statusBarEndboss.setPercentage((enemy.health / 7) * 100);
                        }
                    }

                    this.throwableObject.splice(bottleIndex, 1);


                    sounds.throwing_music.volume = 0;
                    sounds.throwing_music.currentTime = 0;
                    sounds.throwing_music.play();
                }
            });
        });
    }


    checkCollisionEnemies() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !this.character.isDead()) {
                const characterBottom = this.character.y + this.character.height;
                const enemyTop = enemy.y;
                const isJumpingDown = this.character.speedY < 0;
                const isStompKill =
                    isJumpingDown &&
                    characterBottom <= enemyTop + 50;

                if (isStompKill) {
                    enemy.kill();

                    setTimeout(() => {
                        const index = this.level.enemies.indexOf(enemy);
                        if (index > -1) {
                            this.level.enemies.splice(index, 1);
                        }
                    }, 300);

                    this.character.speedY = 10; // bounce effect
                } else {
                    if (!this.character.isHurt()) {
                        this.character.hit();
                        this.statusBar.setPercentage(this.character.energy);

                        if (this.character.energy <= 0) {
                            this.gameOver();
                        }
                    }
                }
            }
        });
    }

    bottleCounter() {
        this.level.bottles.forEach((bottle, index) => {

            if (this.character.isColliding(bottle)) {
                this.character.bottlesCollected++;
                bottle.playsound();
                this.level.bottles.splice(index, 1);
            }
        });
    }





    coinCounter() {

        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.character.coinsCollected++;
                coin.playsound();
                this.level.coins.splice(index, 1);
            }
        });


    }



    showMaxStatusEffect() {
        let effect = document.getElementById('max-status-effect');
        effect.style.display = 'block';
        setTimeout(() => {
            effect.style.display = 'none';
        }, 2000);
    }




    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        if (this.statusBarEndboss) {
            this.addToMap(this.statusBarEndboss);
        }

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);

        if (this.level.endboss) {
            this.addToMap(this.level.endboss);
        }

        this.addObjectsToMap(this.throwableObject);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0);

        if (this.fullscreenIcon && this.fullscreenIcon.complete) {
            this.ctx.drawImage(this.fullscreenIcon, this.iconX, this.iconY, this.iconWidth, this.iconHeight);
        }

        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);

        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo)
        }

        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }


    }
    flipImage(mo) {

        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {

        mo.x = mo.x * -1;
        this.ctx.restore();


    }

}