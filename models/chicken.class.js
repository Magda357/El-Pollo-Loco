class Chicken extends MovableObject {

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'

    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    offset = {
        top: 10,
        right: 5,
        bottom: 10,
        left: 10
    };
    isDying = false;
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.y = 360;
        this.height = 60;
        this.width = 80;
        this.animate();
        this.x = 300 + Math.random() * 2200;
        this.speed = 0.15 + Math.random() * 0.5;

    }

    animate() {
        setInterval(() => {
            if (this.energy > 0) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.energy > 0) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_DEAD);
            }
        }, 400);
    }


    hit() {
        this.energy = 0;
        this.speed = 0;
        this.playAnimation(this.IMAGES_DEAD);
    }

    kill() {
        console.log('enemy is killed');
        this.energy = 0;
        this.isDying = true;
        this.speed = 0;
        this.loadImage('img/3_enemies_chicken/chicken_normal/2_dead/dead.png');
    }





}