/**
 * Represents a game level containing various game elements.
 */
class Level {
    /** @type {Array} List of enemy objects in the level */
    enemies;

    /** @type {Array} List of cloud objects in the level */
    clouds;

    /** @type {Array} List of background objects in the level */
    backgroundObjects;

    /** @type {Array} List of bottle objects in the level */
    bottles;

    /** @type {Array} List of coin objects in the level */
    coins;

    /** @type {number} The x-coordinate where the level ends */
    level_end_x = 2200;

    /**
     * Creates a new Level instance.
     * 
     * @param {Array} enemies - Array of enemies in the level.
     * @param {Array} clouds - Array of clouds in the level.
     * @param {Array} backgroundObjects - Array of background objects.
     * @param {Array} bottles - Array of bottles in the level.
     * @param {Array} coins - Array of coins in the level.
     * @param {Object} endboss - The endboss object for the level.
     */
    constructor(enemies, clouds, backgroundObjects, bottles, coins, endboss) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
        this.endboss = endboss;
    }
}
