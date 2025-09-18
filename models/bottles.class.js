/**
 * Represents a collectible bottle object in the game world.
 * Inherits from {@link MovableObject}.
 */
class Bottle extends MovableObject {
    /**
     * @type {string[]} Array of possible bottle image paths (randomized on creation).
     */
    BOTTLE_IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * @type {{ top: number, right: number, bottom: number, left: number }}
     * Defines the collision offset around the bottle image.
     */
    offset = {
        top: 8,
        right: 10,
        bottom: 8,
        left: 10
    };

    /**
     * Creates a new bottle instance with random position and image.
     */
    constructor() {
        super();
        const randomImage = this.getRandomBottleImage();
        this.loadImage(randomImage);

        /** @type {number} Width of the bottle image. */
        this.width = 45;

        /** @type {number} Height of the bottle image. */
        this.height = 60;

        /** @type {number} Fixed vertical position on the ground. */
        this.y = 370;

        /** @type {number} Randomized horizontal position. */
        this.x = 200 + Math.random() * 2000;
    }

    /**
     * Returns a random bottle image path from the predefined list.
     * @returns {string} The selected image path.
     */
    getRandomBottleImage() {
        const index = Math.floor(Math.random() * this.BOTTLE_IMAGES.length);
        return this.BOTTLE_IMAGES[index];
    }

    /**
     * Plays the sound effect when the bottle is collected by the player.
     */
    playsound() {
        sounds.bottle_collection2.currentTime = 0;
        sounds.bottle_collection2.volume = 1;
        sounds.bottle_collection2.play();
    }
}