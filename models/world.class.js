class World {
    character = new Character();

    level = level1;
    /*enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;*/
    canvas;
    ctx; //context
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();   ////////////////////////////////
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    statusBarEndboss = new StatusBarEndboss();

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();


    }

    setWorld() {
        this.character.world = this;
    }


    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);////////////////
                }
            })

        }, 200);
    }

    draw() {



        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        //---space for fixed objects----
        this.addToMap(this.statusBar);///////////////
        this.addToMap(this.statusBarCoin);///////////////
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarEndboss);

        this.ctx.translate(this.camera_x, 0);



        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);

        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0);




        //Draw() wird immer aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);

        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo)
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }


    }
    flipImage(mo) {

        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {

        mo.x = mo.x * -1;
        this.ctx.restore();


    }
}