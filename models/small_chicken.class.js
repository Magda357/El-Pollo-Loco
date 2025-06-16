class SmallChicken extends MovableObject {
    y = 375;
    height = 40;
    width = 40;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',

    ];

    constructor() {
        super(); //// constructor von Parent Class (MovableObject)
        this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');// used parent method
        this.loadImages(this.IMAGES_WALKING);
        this.x = 300 + Math.random() * 2200; //Zahl zwischen 200 und 800
        this.speed = 0.30 + Math.random() * 0.9;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);//call parent method

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

}