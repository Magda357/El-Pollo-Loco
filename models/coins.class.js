class Coin extends MovableObject {

    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    offset = {
        top: 32,
        right: 32,
        bottom: 32,
        left: 32
    };

    constructor() {
        super().loadImages(this.IMAGES_COINS);
        this.x = 300 + Math.random() * 1800;
        this.y = 100 + Math.random() * 50;
        this.loadImage(this.IMAGES_COINS[0]);
        this.width = 100;
        this.height = 100;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 400);
    }


    playsound() {
        sounds.coin_collection.volume = 0.2;
        sounds.coin_collection.currentTime = 0;
        sounds.coin_collection.play();
    }
}