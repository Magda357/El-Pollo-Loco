class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

        }, 1000 / 25);

    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }


    //character.isColliding(chicken);
    isColliding(mo) {
        if (!mo) return false;
        return (this.x + this.width - this.offset.right) > (mo.x + mo.offset.left) &&
            (this.y + this.height - this.offset.bottom) > (mo.y + mo.offset.top) &&
            (this.x + this.offset.left) < (mo.x + mo.width - mo.offset.right) &&
            (this.y + this.offset.top) < (mo.y + mo.height - mo.offset.bottom);
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
    }

    isAlive() {
        return this.energy > 0;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;


    }

    isDead() {
        return this.energy == 0;


    }

    playAnimation(images) {
        let i = this.currentImage % images.length;


        //let i = 7 % 6; => 1 Rest 1
        //i= 0,1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,5....
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


    moveRight() {
        this.x += this.speed;

    }

    moveLeft() {

        this.x -= this.speed;

    }
    jump() {
        this.speedY = 30;
    }
}




