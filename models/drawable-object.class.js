/**
 * Base class for drawable objects with image loading and drawing capabilities.
 */
class DrawableObject {
    /** @type {HTMLImageElement} */
    img;

    /** @type {Object.<string, HTMLImageElement>} Cached images keyed by path */
    imageCache = {};

    /** Index of the current image in animation sequences */
    currentImage = 0;

    /** X position on the canvas */
    x = 120;

    /** Y position on the canvas */
    y = 280;

    /** Height of the drawable object */
    height = 150;

    /** Width of the drawable object */
    width = 100;

    /**
     * Loads an image from the given path.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current image on the provided canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws a blue frame around the object if it is a Character or Enemy.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken ||
            this instanceof SmallChicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Draws a red offset frame representing the collision box if offset is defined.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawOffsetFrame(ctx) {
        if (this.offset) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';

            const x = this.x + this.offset.left;
            const y = this.y + this.offset.top;
            const width = this.width - this.offset.left - this.offset.right;
            const height = this.height - this.offset.top - this.offset.bottom;
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }

    /**
     * Loads multiple images into the image cache.
     * @param {string[]} arr - Array of image paths to preload.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
