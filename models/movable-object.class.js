/**
 * Represents an object that can move and be drawn on the screen.
 * Extends DrawableObject to inherit drawing capabilities.
 */
class MovableObject extends DrawableObject {
    /** @type {number} Horizontal movement speed */
    speed = 0.15;

    /** @type {boolean} Direction flag; true if facing the opposite direction */
    otherDirection = false;

    /** @type {number} Vertical speed (used for jumping/falling) */
    speedY = 0;

    /** @type {number} Acceleration applied to vertical speed (gravity effect) */
    acceleration = 2.5;

    /** @type {number} Current energy/health of the object */
    energy = 100;

    /** @type {number} Timestamp of the last hit taken (in milliseconds) */
    lastHit = 0;

    /**
     * Applies gravity to the object, updating its vertical position and speed over time.
     * Uses a fixed interval for gravity updates.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above the ground level.
     * Special case: ThrowableObjects are always considered above ground.
     * 
     * @returns {boolean} True if the object is above ground, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }

    /**
     * Checks if this object is colliding with another MovableObject.
     * Takes into account the position, size, and offsets for collision boundaries.
     * 
     * @param {MovableObject} mo - The other movable object to check collision against.
     * @returns {boolean} True if the objects are colliding, false otherwise.
     */
    isColliding(mo) {
        if (!mo) return false;
        return (this.x + this.width - this.offset.right) > (mo.x + mo.offset.left) &&
            (this.y + this.height - this.offset.bottom) > (mo.y + mo.offset.top) &&
            (this.x + this.offset.left) < (mo.x + mo.width - mo.offset.right) &&
            (this.y + this.offset.top) < (mo.y + mo.height - mo.offset.bottom);
    }

    /**
     * Reduces the object's energy by 10 points and updates the last hit timestamp.
     * Energy cannot fall below zero.
     */
    hit() {
        this.energy -= 10;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
    }

    /**
     * Checks if the object is still alive (energy greater than zero).
     * 
     * @returns {boolean} True if energy is above zero, false otherwise.
     */
    isAlive() {
        return this.energy > 0;
    }

    /**
     * Checks if the object is currently in a "hurt" state.
     * The hurt state lasts 1 second after the last hit.
     * 
     * @returns {boolean} True if hurt, false otherwise.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Checks if the object is dead (energy is zero).
     * 
     * @returns {boolean} True if dead, false otherwise.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Plays an animation by cycling through the given array of image paths.
     * Updates the displayed image based on the current frame index.
     * 
     * @param {string[]} images - Array of image file paths for the animation frames.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right by its speed value.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its speed value.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Initiates a jump by setting the vertical speed upwards.
     */
    jump() {
        this.speedY = 30;
    }
}
