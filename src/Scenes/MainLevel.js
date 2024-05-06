class MainLevel extends Phaser.Scene {
    constructor() {
        
        super("mainLevel");
        this.my = {sprite: {}};

        this.lowestShipY = 260;
        this.leftShipX = 40;
        this.rightShipX = 700;
        this.bulletCooldown = 8;


    }

    preload() {

        this.load.setPath("./assets/");
        this.load.image("playerRight", "player/alienBiege_climb2.png");
        this.load.image("shipTank", "ships/shipGreen_manned.png");
        this.load.image("shipFighter", "ships/shipPink_manned.png");
        this.load.image("shipLaser", "ships/shipBlue_manned.png");
        this.load.image("impact", "ships/laserYellow_burst.png");
        this.load.image("groundImpact", "ships/laserYellow_groundBurst.png");
        this.load.image("laser", "ships/laserBlue1.png");
        this.load.image("bullet", "bullets/slimeBlock_hit.png");
        this.load.image("planet", "planet/planetMid.png");
        this.load.audio("playerShootSound", "audio/laserSmall_000.ogg");
        this.load.audio("enemyShootSound", "audio/laserSmall_001.ogg");
        this.load.audio("explosionSound", "audio/explosionCrunch_000.ogg");
        this.load.audio("hitSound", "audio/laserLarge_002.ogg");

    }

    create() {

        // reset level vars
        this.bulletCooldownCounter = 0;
        this.score = 0;
        this.lives = 3;
        this.gameover = false;

        let my = this.my;

        // add background
        for (let i = 0; i < game.config.width; i += 128) {
            this.add.sprite(i, 700, "planet");
        }

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.reset = this.input.keyboard.addKey("R");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, {fontSize: '32px'});
        this.livesText = this.add.text(600, 16, 'Lives: ' + this.lives, {fontSize: '32px'});

        my.sprite.player = new Player(this, this.left, this.right, this.space, 8);

        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "bullet",
            maxSize: 20,
            runChildUpdate: true
        });

        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });

        my.sprite.ships = new Phaser.Structs.List();

        
        for (let i = this.leftShipX; i < this.rightShipX; i += 60) {
            
            my.sprite.ships.add(new TankShip(this, i, this.lowestShipY));
        }

        for (let i = this.leftShipX; i < this.rightShipX; i += 60) {
            
            my.sprite.ships.add(new TankShip(this, i, this.lowestShipY - 60));
        }

        for (let i = this.leftShipX; i < this.rightShipX; i += 60) {
            
            my.sprite.ships.add(new FighterShip(this, i, this.lowestShipY - 120));
        }

        for (let i = this.leftShipX; i < this.rightShipX; i += 60) {
            
            my.sprite.ships.add(new FighterShip(this, i, this.lowestShipY - 180));
        }

    }

    update() {

        if (!this.gameover) {
        
            let my = this.my;

            my.sprite.player.update();

            this.bulletUpdate();

            this.collisionUpdate();

            for (let i of my.sprite.ships.getAll()) {
                i.update();
            }

        }
        else {

            if (this.reset.isDown) {

                this.scene.start("mainLevel");
            }
        }
    }

    bulletUpdate() {

        let my = this.my

        this.bulletCooldownCounter--;

        if (this.space.isDown) {

            if (this.bulletCooldownCounter < 0) {

                if (this.bulletShoot(my.sprite.player, false)) {

                    this.bulletCooldownCounter = this.bulletCooldown;
                }
            }
        }
    }

    bulletShoot(sprite, enemy) {

        let my = this.my

        let bullet = my.sprite.bulletGroup.getFirstDead();

        if (bullet != null) {

            bullet.makeActive();
            bullet.x = sprite.x;

            if (!enemy) {
                bullet.enemy = false;
                bullet.y = sprite.y - (sprite.displayHeight/2);
                this.sound.play("playerShootSound");
            }
            else {
                bullet.enemy = true;
                bullet.y = sprite.y + (sprite.displayHeight/2);
                this.sound.play("enemyShootSound");
            }

            
            
            return true;
        }

        return false;
    }


    collisionUpdate() {

        let my = this.my;

        for (let bullet of my.sprite.bulletGroup.getChildren().filter((bullet) => bullet.active)) {

            if (bullet.enemy) { 
                
                if (this.collides(my.sprite.player, bullet)) {
                
                    bullet.y = 1000;
                    this.playerHit();
                }
            }
            else {

                for (let ship of my.sprite.ships.getAll()) {

                    if (this.collides(ship, bullet)) {
                
                        bullet.y = -100;
                        this.shipHit(ship);

                    }
                }
            }


        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    playerHit() {
        
        console.log("hit");
        this.lives--;
        this.livesText.setText('Lives: ' + this.lives);

        this.my.sprite.player.setAlpha(this.my.sprite.player.alphaTopLeft - 0.2);
        this.sound.play("hitSound");

        if (this.lives == 0) {
            this.my.sprite.player.visible = false;
            console.log("game over");
            this.add.text(400, 300, "You Lose", {fontSize: '64px'}).setOrigin(0.5);
            this.add.text(400, 350, "(Press 'R' to restart)", {fontSize: '32px'}).setOrigin(0.5);
            this.gameover = true;
        }
    }

    shipHit(ship) {

        console.log("ship hit");
        ship.visible = false;
        this.my.sprite.ships.remove(ship);
        ship.destroy();
        this.sound.play("explosionSound");

        this.score += ship.points;
        this.scoreText.setText('Score: ' + this.score);

        if (this.my.sprite.ships.length == 0) {
            console.log("game win");
            this.add.text(400, 300, "You Win!", {fontSize: '64px'}).setOrigin(0.5);
            this.add.text(400, 350, "(Press 'R' to restart)", {fontSize: '32px'}).setOrigin(0.5);
            this.gameover = true;
        }
    }


}