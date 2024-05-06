class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, leftKey, rightKey, shootKey) {
        
        super(scene, game.config.width/2, game.config.height - 100, "playerRight");

        this.setScale(.4);
        this.left = leftKey;
        this.right = rightKey;
        this.playerSpeed = 8;

        scene.add.existing(this);

        return this;
    }

    update() {
        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (this.x > (this.displayWidth/2) + 20) {
                this.x -= this.playerSpeed;
                this.setFlipX(true);
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth/2)) - 20) {
                this.x += this.playerSpeed;
                this.setFlipX(false);
            }
        }
    }

}