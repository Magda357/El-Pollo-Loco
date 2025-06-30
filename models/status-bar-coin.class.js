/**
 * Represents the coin status bar UI element displaying coin collection progress.
 * Extends DrawableObject to handle rendering of images.
 */
class StatusBarCoin extends DrawableObject {

    /** @type {string[]} Image paths representing different coin fill levels */
    IMAGES_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];

    /** @type {number} Current coin fill percentage (0 to 100) */
    percentage = 100;

    /**
     * Creates a new StatusBarCoin instance, loads images, and initializes position and size.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.x = 50;
        this.y = 50;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Sets the coin fill percentage and updates the displayed image accordingly.
     * @param {number} percentage - The current coin fill percentage (0 to 100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_COIN[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index based on the current percentage to select the correct coin image.
     * @returns {number} The index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage == 100)
            return 5;
        else if (this.percentage > 80)
            return 4;
        else if (this.percentage > 60)
            return 3;
        else if (this.percentage > 40)
            return 2;
        else if (this.percentage > 20)
            return 1;
        else
            return 0;
    }
}
