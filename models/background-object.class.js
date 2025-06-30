/**
 * Represents a background image object in the game that can be positioned and moved.
 * Inherits from {@link MovableObject}.
 */
class BackgroundObject extends MovableObject {
    /** @type {number} The width of the background object in pixels. */
    width = 720;

    /** @type {number} The height of the background object in pixels. */
    height = 480;

    /**
     * Creates a new background object.
     * @param {string} imagePath - The file path to the background image.
     * @param {number} x - The horizontal position of the background object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;

        // Place it at the bottom of the canvas
        this.y = 480 - this.height;
    }
}