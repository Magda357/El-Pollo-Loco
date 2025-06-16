class Bottle extends MovableObject {
    width = 45;
    height = 60;
    y = 360;

    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'


    ];

    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = 250 + Math.random() * 2000; //Zahl zwischen 200 und 2200

    }
}