class TankShip extends Phaser.GameObjects.PathFollower {

    constructor(scene, x, y) {

        super(scene, new Phaser.Curves.Spline(
            [0, 0, 
            100, 100, 
            -200, 150, 
            300, 200, 
            -700, 200, 
            -700, -400, 
            0, -400, 
            0, 0]), x, y, "shipTank");

        this.setScale(.4);
        this.points = 100;
        this.speed = 1;

        this.activateProb = 0.0002;
        this.attacking = false;

        this.movingRight = true;
        this.pos = 0;
        this.posRange = 100;

        this.pathOffset = new Phaser.Math.Vector2(x, y);
        this.curr_x = x;
        this.const_y = y;

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
                duration: 7000,
            });
        }

        this.pathOffset.x = this.curr_x;
    }

}