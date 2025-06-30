/**
 * Represents a general status bar (e.g., health bar) UI element.
 * Extends DrawableObject to manage rendering status images.
 */
class StatusBar extends DrawableObject {

    /** 
     * @type {string[]} Array of image paths representing different status levels 
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',   // 0%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',  // 20%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',  // 40%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',  // 60%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',  // 80%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'  // 100%
    ];

    /** @type {number} Current percentage status (0 to 100) */
    percentage = 100;

    /**
     * Creates a new StatusBar instance, loads images, and sets position and size.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 50;
        this.y = 10;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the status bar's percentage and changes the displayed image accordingly.
     * @param {number} percentage - The new percentage value (0 to 100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the appropriate image index based on the current percentage.
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
