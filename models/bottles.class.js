class Bottle extends MovableObject {

    BOTTLE_IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    offset = {
        top: 8,
        right: 10,
        bottom: 8,
        left: 10
    };

    constructor() {
        super();
        const randomImage = this.getRandomBottleImage();
        this.loadImage(randomImage);

        this.width = 45;
        this.height = 60;
        this.y = 370;
        this.x = 200 + Math.random() * 2000;

    }

    getRandomBottleImage() {
        const index = Math.floor(Math.random() * this.BOTTLE_IMAGES.length);
        return this.BOTTLE_IMAGES[index];
    }

    playsound() {
        sounds.bottle_collection.volume = 0.9;
        sounds.bottle_collection.currentTime = 0;
        sounds.bottle_collection.play();
    }
}