class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;


    //loadImage('img/test.png');
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    draw(ctx) {

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    drawFrame(ctx) {

        if (this instanceof Character || this instanceof Chicken ||
            this instanceof SmallChicken || this instanceof Endboss) {

            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }


    drawOffsetFrame(ctx) {
        if (this.offset) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';


            const x = this.x + this.offset.left;
            const y = this.y + this.offset.top;
            const width = this.width - this.offset.left - this.offset.right;
            const height = this.height - this.offset.top - this.offset.bottom;

            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }



    /* 
    @param {Array} arr - ['img/image1.png' , 'img/image2.png',...]
 
    */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


}