class Cloud extends MovableObject {
    y = 50;
    width = 500;
    height = 250;

    constructor(x) {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = x; //Zahl zwischen 200 und 700

        this.animante();
    }

    animante() {
        this.moveLeft();
    }



}