class FighterShip extends Phaser.GameObjects.PathFollower {

    constructor(scene, x, y) {

        super(scene, new Phaser.Curves.Spline(
            [0, 0, 
            200, 200,
            0, 350, 
            -100, 250,
            100, 250,
            0, 350,
            -700, 200, 
            -700, -400,
            0, -400, 
            0, 0]), x, y, "shipFighter");

        this.setScale(.4);
        this.points = 200;
        this.speed = 1;
        
        this.activateProb = 0.0002;
        this.attacking = false;

        this.shootProb = 0.005;

        this.movingRight = true;
        this.pos = 0;
        this.posRange = 100;

        this.pathOffset = new Phaser.Math.Vector2(x, y);
        this.curr_x = x;
        this.const_y = y;
        
        this.scene = scene;

        scene.add.existing(this);

        this.startFollow({
            from:0,
            to: 0,
            delay: 0,
            duration: 0,
        });

        return this;
    }

    update() {


        if (this.movingRight) {
            this.curr_x += this.speed;
            this.pos ++;
            if (this.pos == this.posRange) {
                console.log("switch");
                this.movingRight = false;
            }
        }
        else {
            this.curr_x -= this.speed;
            this.pos--;
            if (this.pos == 0) {
                this.movingRight = true;
            }
        }

        if (this.attacking) {

            if (!this.isFollowing()) {

                this.pathOffset.x = this.curr_x;
                this.attacking = false;
            }
        }
        else if (Phaser.Math.FloatBetween(0,1) < this.activateProb && this.pathOffset.y == this.const_y) {

            console.log("attack");

            this.attacking = true;
            this.startFollow({
                from:0,
                to: 1,
                delay: 0,
                duration: 5000,
            });
        }

        if (Phaser.Math.FloatBetween(0,1) < this.shootProb) {

            this.scene.bulletShoot(this, true);
        }

        this.pathOffset.x = this.curr_x;
    }

}