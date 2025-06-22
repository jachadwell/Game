import Phaser from "phaser";
import { EventBus } from "../EventBus";
import { Player } from "./Player";
import { getObjectCustomPropertyValue } from "../Classes/SceneLoader";

type EnemyConfig = {
    scene: Phaser.Scene;
    player: Player
    gameobject: Phaser.Types.Tilemaps.TiledObject
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    private gameobject: Phaser.Types.Tilemaps.TiledObject;
    private maxHealth = 5;
    private health = 5;
    private id: string;
    private bar: Phaser.GameObjects.Graphics;

    constructor(config: EnemyConfig) {
        const { scene, player, gameobject } = config
        super(scene, config.gameobject.x!, config.gameobject.y!, 'dude');

        // Set class properties
        this.gameobject = gameobject;
        this.id = getObjectCustomPropertyValue(gameobject, "enemyId");

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        // Play animation
        this.play({ key: "mushroom-idle" })

        // Create health bar
        this.bar = new Phaser.GameObjects.Graphics(scene);
        scene.add.existing(this.bar);

        // Call update
        scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        });

        const hitAreaWidth = this.width * 0.3;
        const hitAreaHeight = this.height * 0.5;
        const hitArea = new Phaser.Geom.Rectangle(
            this.width / 2 - hitAreaWidth / 2,
            this.height / 2 - hitAreaHeight / 2,
            hitAreaWidth,
            hitAreaHeight
        );

        this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {

            })
            .on('pointerover', () => {
                scene.input.setDefaultCursor('pointer');
            })
            .on('pointerout', () => {
                scene.input.setDefaultCursor('default');
            })

        EventBus.on(this.id, (action: string, damage: number) => {
            if (action === "attack") {
                this.updateHealth(-damage);
            }
        })
    }

    update() {
        this.drawHealth();
    }

    destroy() {
        this.bar.destroy();
        super.destroy();
    }

    drawHealth() {
        const width = 40;
        const height = 7;

        this.bar.clear();

        if (this.health === 0) {
            return;
        }

        // Draw the white background
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x - (width / 2), this.y - 30, width, height);
        // Set the health bar color based on the health value
        this.bar.fillStyle(this.health <= 2 ? 0xff0000 : 0x00ff00);
        // Calculate the width of the health bar based on current health
        const currentWidth = Math.floor((width / 5) * this.health);
        // Draw the health bar
        this.bar.fillRect(this.x - (width / 2), this.y - 30, currentWidth, height);
    }

    updateHealth(amount: number) {

        if (this.health + amount <= 0) {
            this.health = 0;
            this.destroy();
        }

        if (this.health + amount > this.maxHealth) {
            this.health = this.maxHealth;
        }

        this.health += amount;
    }
}