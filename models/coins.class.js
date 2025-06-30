/**
 * Represents a collectible coin that animates and can play a collection sound.
 * Extends {@link MovableObject} for position and animation capabilities.
 */
class Coin extends MovableObject {

    /**
     * Array of image paths for coin animation frames.
     * @type {string[]}
     */
    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Offset for collision detection or hitbox adjustments.
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = {
        top: 32,
        right: 32,
        bottom: 32,
        left: 32
    };

    /**
     * Creates a new Coin instance with randomized position.
     */
    constructor() {
        super().loadImages(this.IMAGES_COINS);
        this.x = 300 + Math.random() * 1800;
        this.y = 100 + Math.random() * 50;
        this.loadImage(this.IMAGES_COINS[0]);
        this.width = 100;
        this.height = 100;
        this.animate();
    }

    /**
     * Starts the animation cycling through coin images.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 400);
    }

    /**
     * Plays the sound effect for collecting a coin.
     */
    playsound() {
        sounds.coin_collection.volume = 0.2;
        sounds.coin_collection.currentTime = 0;
        sounds.coin_collection.play();
    }
}
