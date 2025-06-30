/**
 * Represents a cloud in the background that moves left across the screen.
 * Extends {@link MovableObject} to inherit movement capabilities.
 */
class Cloud extends MovableObject {

    /**
     * Creates a new Cloud instance.
     * @param {number} x - The initial horizontal position of the cloud.
     */
    constructor(x) {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = x;
        this.y = 50;
        this.width = 500;
        this.height = 250;
        this.animate();
    }

    /**
     * Starts cloud movement to the left.
     */
    animate() {
        this.moveLeft();
    }
}