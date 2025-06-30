/**
 * Represents the Endboss status bar UI element showing health or status progress.
 * Extends DrawableObject to handle rendering of status bar images.
 */
class StatusBarEndboss extends DrawableObject {

    /** @type {string[]} Image paths representing different Endboss status levels */
    IMAGES_ENDBOSS_STATUS = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ];

    /** @type {number} The x-position of the status bar on the screen */
    x = 500;

    /** @type {number} The y-position of the status bar on the screen */
    y = 70;

    /** @type {number} The current percentage status (0 to 100) */
    percentage = 100;

    /**
     * Creates a new StatusBarEndboss instance, loads images and sets initial size and percentage.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSS_STATUS);
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Sets the current percentage and updates the displayed status bar image.
     * @param {number} percentage - Current status percentage (0 to 100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_ENDBOSS_STATUS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the correct image index based on the current percentage value.
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
