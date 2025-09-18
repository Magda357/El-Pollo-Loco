class World {
    /**
     * @type {Character} The main character controlled by the player.
     */
    character = new Character();

    /**
     * @type {Level} The current level of the game.
     */
    level = level1;

    /** @type {HTMLCanvasElement} The canvas element for rendering the game. */
    canvas;

    /** @type {CanvasRenderingContext2D} The 2D rendering context of the canvas. */
    ctx;

    /** @type {Keyboard} Object to capture keyboard input states. */
    keyboard;

    /** @type {number} The x-coordinate for camera translation to simulate movement. */
    camera_x = 0;

    /** @type {StatusBar} The health/status bar for the main character. */
    statusBar = new StatusBar();

    /** @type {StatusBarCoin} The status bar for collected coins. */
    statusBarCoin = new StatusBarCoin();

    /** @type {StatusBarBottle} The status bar for collected throwable bottles. */
    statusBarBottle = new StatusBarBottle();

    /** @type {ThrowableObject[]} Array of throwable objects (bottles) currently in use. */
    throwableObject = [];

    /** @type {number} Maximum number of throwable bottles collectible. */
    MAX_BOTTLES = 10;

    /** @type {number} Maximum number of coins collectible. */
    MAX_COINS = 10;

    /** @type {boolean} Flag to indicate if the character can currently throw a bottle. */
    canThrow = true;

    /** @type {number} Cooldown time (in milliseconds) between bottle throws. */
    throwCooldown = 500;

    /** @type {number} The maximum health of the character (currently unused). */
    health = 7;

    /** @type {number} Timeout ID used for max status effect (if needed). */
    maxStatusTimeout;

    /** @type {number[]} Array to keep track of active interval IDs for clearing later. */
    intervalIds = [];

    /** @type {number|null} The ID of the current animation frame for cancellation. */
    animationFrameId = null;

    /**
     * Creates a new World instance.
     * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;


        this.isMuted = false;
        this.muteImg = new Image();
        this.muteImg.src = 'img/instruction-bild/no-sound.png'; // Pfad zu deinem Mute-Icon
        this.unmuteImg = new Image();
        this.unmuteImg.src = 'img/instruction-bild/sound.png';

        this.fullscreenImg = new Image();
        this.fullscreenImg.src = 'img/instruction-bild/maximize.png';

        this.endbossStatusbarCreated = false;
        this.statusBarEndboss = null;
        this.endbossActivated = false;
        this.setWorld();
        this.run();

        // Find the endboss in the current level's enemies and assign it.
        this.endboss = this.level.enemies.find(e => e instanceof Endboss);
        this.level.endboss = this.endboss;

        this.iconX = this.canvas.width - 60;
        this.iconY = 10;
        this.iconWidth = 48;
        this.iconHeight = 48;

        this.draw();
    }


    /**
     * Assigns this world instance to the character and endboss (if any).
     */
    setWorld() {
        this.character.world = this;
        if (this.level.endboss) {
            this.level.endboss.world = this;
        }
    }

    drawMuteIcon() {
        const icon = this.isMuted ? this.muteImg : this.unmuteImg;
        // Position oben rechts im Canvas
        const x = this.canvas.width - 60;
        const y = 20;
        this.ctx.drawImage(icon, x, y, 40, 40);
    }

    drawFullscreenIcon() {
        const x = this.canvas.width - 120;
        const y = 20;
        this.ctx.drawImage(this.fullscreenImg, x, y, 40, 40);
    }

    /**
     * Starts animations for all enemies in the level.
     */
    startEnemyAnimation() {
        this.level.enemies.forEach(enemy => {
            if (enemy.animate) {
                enemy.animate();
            }
        });
    }

    /**
     * Starts the main game loops for collision detection, throwing, and boss activation.
     */
    run() {
        this.intervalIds.push(setInterval(() => this.checkCollisions(), 10));
        this.intervalIds.push(setInterval(() => this.checkThrowObjects(), 10));
        this.intervalIds.push(setInterval(() => this.checkBottleHitsEnemies(), 5));
        this.intervalIds.push(setInterval(() => this.activateEndboss(), 200));
    }

    /**
     * Activates the endboss when the character is within a certain distance.
     */
    activateEndboss() {
        let endboss = this.level.endboss;
        if (!endboss || !this.character) return;

        let distance = endboss.x - (this.character.x + this.character.width);

        if (distance <= 400 && !this.endbossActivated) {
            this.endbossActivated = true;
            this.statusBarEndboss = new StatusBarEndboss();
            this.endbossStatusbarCreated = true;
            endboss.currentState = 'alert';
        }
    }

    /**
     * Creates the endboss status bar if the character is near the endboss.
     */
    createEndbossStatusbar() {
        if (this.isCharacterNearEndboss() && !this.endbossStatusbarCreated) {
            this.statusBarEndboss = new StatusBarEndboss();
            this.endbossStatusbarCreated = true;
        }
    }

    /**
     * Checks if the player wants to throw a bottle and handles throwing logic.
     */
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

    /**
     * Checks all collisions: enemies, bottles, coins, and updates status bars.
     */
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

    /**
     * Checks if thrown bottles hit any enemies and applies effects.
     */
    checkBottleHitsEnemies() {
        this.throwableObject.forEach((bottle) => {
            if (bottle.isSplashed) return;

            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding(enemy)) {
                    this.handleEnemyHit(bottle, enemy, enemyIndex);
                    this.playThrowSound();
                }
            });
        });
    }

    /**
     * Handles logic when an enemy is hit by a bottle.
     * @param {ThrowableObject} bottle - The bottle object.
     * @param {Enemy} enemy - The enemy hit.
     * @param {number} enemyIndex - Index of the enemy in the enemies array.
     */
    handleEnemyHit(bottle, enemy, enemyIndex) {
        if (!(enemy instanceof Endboss)) {
            if (enemy.kill) enemy.kill();
            setTimeout(() => { bottle.splash(); }, 1000);
            setTimeout(() => { this.level.enemies.splice(enemyIndex, 1); }, 220);
        } else {
            if (!enemy.isDead) {
                bottle.splash();
                enemy.takeDamage();
                this.statusBarEndboss.setPercentage((enemy.health / 7) * 100);
            }
        }
    }

    /**
     * Plays the sound effect for throwing a bottle.
     */
    playThrowSound() {
        sounds.throwing_music.volume = 0.5;
        sounds.throwing_music.currentTime = 0;
        sounds.throwing_music.play();
    }

    /**
     * Checks collisions between the character and enemies.
     * If stomped, kills the enemy, otherwise damages the character.
     */
    checkCollisionEnemies() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !this.character.isDead() && !enemy.dead) {
                if (this.isEnemyStomped(enemy)) {
                    this.handleEnemyKill(enemy);
                } else {
                    this.handleCharacterDamage();
                }
            }
        });
    }

    /**
     * Determines if the enemy is stomped by the character.
     * @param {Enemy} enemy - The enemy to check.
     * @returns {boolean} True if stomped, false otherwise.
     */
    isEnemyStomped(enemy) {
        const isJumping = this.character.speedY < 0.5;
        const predictedBottom = this.character.y + this.character.height + this.character.speedY * 1.5;

        if (enemy instanceof SmallChicken) {
            return isJumping && predictedBottom <= enemy.y + enemy.height * 0.3;
        } else {
            return isJumping && predictedBottom <= enemy.y + enemy.height * 0.5;
        }
    }

    /**
     * Handles killing an enemy and bouncing the character up.
     * @param {Enemy} enemy - The enemy to kill.
     */
    handleEnemyKill(enemy) {
        enemy.kill();
        enemy.dead = true;
        this.character.speedY = 10;

        setTimeout(() => {
            const index = this.level.enemies.indexOf(enemy);
            if (index > -1) {
                this.level.enemies.splice(index, 1);
            }
        }, 200);
    }

    /**
     * Handles damaging the character and updating health/status bar.
     */
    handleCharacterDamage() {
        if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);

            if (this.character.energy <= 0) {
                window.gameOver();
            }
        }
    }

    /**
     * Counts and collects bottles collided with the character.
     */
    bottleCounter() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottlesCollected++;
                bottle.playsound();
                this.level.bottles.splice(index, 1);
            }
        });
    }

    /**
     * Counts and collects coins collided with the character.
     */
    coinCounter() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.character.coinsCollected++;
                coin.playsound();
                this.level.coins.splice(index, 1);
            }
        });
    }

    /**
     * Shows a visual effect when max bottles and coins are collected.
     */
    showMaxStatusEffect() {
        let effect = document.getElementById('max-status-effect');
        effect.style.display = 'block';
        setTimeout(() => {
            effect.style.display = 'none';
        }, 2000);
    }

    /**
     * Clears all intervals and animation frames to stop the game loop.
     */
    clearWorld() {
        this.intervalIds.forEach(id => clearInterval(id));
        this.intervalIds = [];

        if (this.character) {
            this.character.clearCharacterIntervals();
        }

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Main draw loop for the game world.
     * Clears canvas, draws all objects and UI elements, then schedules next frame.
     */
    draw() {
        this.clearCanvas();
        this.drawBackgroundObjects();
        this.drawStatusBars();
        this.drawForegroundObjects();
        this.scheduleNextFrame();
        this.drawMuteIcon();
        this.drawFullscreenIcon();
    }

    /**
     * Clears the entire canvas.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws background objects with camera translation.
     */
    drawBackgroundObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws all status bars on the screen.
     */
    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        if (this.statusBarEndboss) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    /**
     * Draws foreground objects including character, enemies, and projectiles with camera translation.
     */
    drawForegroundObjects() {
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
    }



    /**
     * Schedules the next animation frame for continuous drawing.
     */
    scheduleNextFrame() {
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Adds multiple objects to the drawing map.
     * @param {Drawable[]} objects - Array of drawable game objects.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {

            this.addToMap(o);
        });
    }

    /**
     * Adds a single drawable object to the canvas, flipping image if needed.
     * @param {Drawable} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the image horizontally before drawing to simulate facing the other direction.
     * @param {Drawable} mo - The object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the image orientation and context after flipping.
     * @param {Drawable} mo - The object to restore.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }


}
