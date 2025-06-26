class Cloud extends MovableObject {

    constructor(x) {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = x;
        this.y = 50;
        this.width = 500;
        this.height = 250;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }



}