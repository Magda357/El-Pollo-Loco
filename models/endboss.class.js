/**
 * Represents the Endboss enemy with multiple animation states and behaviors.
 * Extends MovableObject for movement capabilities.
 */
class Endboss extends MovableObject {
    /** @type {string[]} Image paths for alert animation */
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

    /** @type {string[]} Image paths for walking animation */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    /** @type {string[]} Image paths for attack animation */
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

    /** @type {string[]} Image paths for hurt animation */
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /** @type {string[]} Image paths for dead animation */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates an Endboss instance with initial settings, loads images, and starts animation.
     */
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

        this.currentState = 'idle'; // Current animation/state ('idle', 'alert', 'attack', 'chase', 'hurt', 'dead')
        this.isDead = false;
        this.isDeadAnimationPlayed = false;
        this.isHurt = false;
        this.alertPlayed = false;
        this.attackStarted = false;

        this.offset = { top: 22, right: 22, bottom: 22, left: 22 };

        this.animate();
    }

    /**
     * Starts the main animation loop controlling behavior and animations based on state.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            if (this.processDeath()) return;
            if (this.processHurt()) return;

            const near400 = this.isCharacterNear(400);
            const near900 = this.isCharacterNear(900);

            this.handleCurrentState(near400, near900);
        }, 150);
    }

    /**
     * Checks if the Endboss is dead and triggers death animation and logic.
     * @returns {boolean} True if death was processed, otherwise false.
     */
    processDeath() {
        if (this.isDead) {
            this.playDeathAnimationOnce();
            this.die();
            return true;
        }
        return false;
    }

    /**
     * Checks if the Endboss is hurt and plays hurt animation, then resets hurt state after delay.
     * @returns {boolean} True if hurt was processed, otherwise false.
     */
    processHurt() {
        if (this.isHurt) {
            this.currentState = 'hurt';
            this.playAnimation(this.IMAGES_HURT);
            this.resetHurtAfterDelay();
            return true;
        }
        return false;
    }

    /**
     * Resets the hurt state after a short delay and switches to attack state if not dead.
     */
    resetHurtAfterDelay() {
        setTimeout(() => {
            this.isHurt = false;
            if (!this.isDead) {
                this.currentState = 'attack';
            }
        }, 500);
    }

    /**
     * Determines which behavior method to call based on current state.
     * @param {boolean} near400 - Is the character near within 400 units.
     * @param {boolean} near900 - Is the character near within 900 units.
     */
    handleCurrentState(near400, near900) {
        switch (this.currentState) {
            case 'idle':
                this.handleIdleState(near400);
                break;
            case 'alert':
                this.handleAlertState();
                break;
            case 'attack':
                this.handleAttackState();
                break;
            case 'chase':
                this.handleChaseState(near900);
                break;
        }
    }

    /**
     * Handles behavior when in idle state.
     * @param {boolean} near400 - If character is near within 400 units.
     */
    handleIdleState(near400) {
        if (near400) {
            this.currentState = 'alert';
            this.alertPlayed = false;
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Plays alert animation and triggers transition to attack after delay.
     */
    handleAlertState() {
        this.playAnimation(this.IMAGES_ALERT);

        if (!this.alertPlayed) {
            this.alertPlayed = true;
            this.transitionToAttackDelayed();
        }
    }

    /**
     * Changes state to attack after 700 milliseconds.
     */
    transitionToAttackDelayed() {
        setTimeout(() => {
            this.currentState = 'attack';
        }, 700);
    }

    /**
     * Plays attack animation and sound, then transitions to chase after delay.
     */
    handleAttackState() {
        this.playAnimation(this.IMAGES_ATTACK);

        if (!this.attackStarted) {
            this.attackStarted = true;
            this.playSound();
            this.transitionToChaseDelayed();
        }
    }

    /**
     * Changes state to chase after 1000 milliseconds.
     */
    transitionToChaseDelayed() {
        setTimeout(() => {
            this.currentState = 'chase';
            this.attackStarted = false;
        }, 1000);
    }

    /**
     * Handles chasing behavior by moving toward the character or switching back to idle.
     * @param {boolean} near900 - If character is near within 900 units.
     */
    handleChaseState(near900) {
        if (near900) {
            this.playAnimation(this.IMAGES_WALKING);
            this.moveTowardCharacter();
        } else {
            this.currentState = 'idle';
        }
    }

    /**
     * Stops movement, pauses music, and marks Endboss as dead.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        sounds.endboss_music.pause();
        sounds.endboss_music.currentTime = 0;
    }

    /**
     * Plays the Endboss' music/sound effect at a set volume.
     */
    playSound() {
        sounds.endboss_music.volume = 0.8;
        sounds.endboss_music.play();
    }

    /**
     * Moves the Endboss toward the character's x position.
     * Adjusts direction and movement based on relative position.
     */
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

    /**
     * Applies damage to the Endboss, triggers hurt state and checks for death.
     */
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

    /**
     * Checks if the character is within a specified horizontal distance.
     * @param {number} distance - Distance to check proximity.
     * @returns {boolean} True if character is near, false otherwise.
     */
    isCharacterNear(distance) {
        if (!world || !world.character) return false;
        const dx = Math.abs(this.x - world.character.x);
        return dx < distance;
    }

    /**
     * Plays the death animation once and then triggers win condition.
     */
    playDeathAnimationOnce() {
        if (this.isDeadAnimationPlayed) return;

        this.playAnimation(this.IMAGES_DEAD);
        this.isDeadAnimationPlayed = true;

        setTimeout(() => {
            this.y = -1000; // Hide off screen
            this.speed = 0;
            win(); // Call game win function
        }, 1000);
    }
}
