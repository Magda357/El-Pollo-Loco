class Coin extends MovableObject {
    width = 70;
    height = 70;


    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES_COINS);
        this.x = 300 + Math.random() * 1800; //Zahl zwischen 200 und 2200
        this.y = 200 + Math.random() * 50;
        this.loadImage(this.IMAGES_COINS[0]);

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 400);
    }
}