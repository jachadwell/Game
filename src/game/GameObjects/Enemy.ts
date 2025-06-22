import Phaser from "phaser";
import { EventBus } from "../EventBus";
import { Player } from "./Player";
import { getObjectCustomPropertyValue } from "../Classes/SceneLoader";

type EnemyConfig = {
    scene: Phaser.Scene;
    player: Player;
    gameobject: Phaser.Types.Tilemaps.TiledObject;
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private gameobject: Phaser.Types.Tilemaps.TiledObject;
    private maxHealth = 5;
    private health = 5;
    private id: string;
    private bar: Phaser.GameObjects.Graphics;
    private moveEvent;

    constructor(config: EnemyConfig) {
        const { scene, player, gameobject } = config;
        super(scene, config.gameobject.x!, config.gameobject.y!, "dude");

        // Set class properties
        // this.scene = scene;
        this.gameobject = gameobject;
        this.id = getObjectCustomPropertyValue(gameobject, "enemyId");

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);

        // Play animation
        this.play({
            key: "mushroom-idle",
            startFrame: Math.floor(Math.random() * 5) + 1,
        });

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

        this.moveEvent = scene.time.addEvent({
            delay: Math.floor(Math.random() * 5000) + 5000, // 5 seconds
            loop: true,
            callback: () => {
                // Move the sprite to the right
                const min = -100;
                const max = 100;
                this.setVelocityX(Math.random() * (max - min) + min);
                this.setVelocityY(Math.random() * (max - min) + min);

                // Stop movement after 2 seconds
                scene.time.delayedCall(500, () => {
                    this.setVelocity(0);
                });
            },
        });

        this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
            .on("pointerdown", () => {})
            .on("pointerover", () => {
                scene.input.setDefaultCursor("pointer");
            })
            .on("pointerout", () => {
                scene.input.setDefaultCursor("default");
            });

        EventBus.on(this.id, (action: string, damage: number) => {
            if (action === "attack") {
                this.updateHealth(-damage);
            }
        });
    }

    update() {
        this.drawHealth();

        const velocity = this.body?.velocity;
        if (!velocity) {
            console.log("Velocity is falsy!");
            return;
        }
        if (velocity.x === 0 && velocity.y === 0) {
            this.play(
                {
                    key: "mushroom-idle",
                    startFrame: Math.floor(Math.random() * 5),
                },
                true
            );
        } else {
            this.play("mushroom-walk", true);
        }
    }

    destroy() {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.moveEvent.remove();
        this.bar.destroy();

        this.play("mushroom-die", true);
        setTimeout(() => super.destroy(), 10000);
        // super.destroy();
    }

    drawHealth() {
        const width = 40;
        const height = 7;

        this.bar.clear();

        if (this.health === 0 || this.health === this.maxHealth) {
            return;
        }

        // Draw the white background
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x - width / 2, this.y - 30, width, height);
        // Set the health bar color based on the health value
        this.bar.fillStyle(this.health <= 2 ? 0xff0000 : 0x00ff00);
        // Calculate the width of the health bar based on current health
        const currentWidth = Math.floor((width / 5) * this.health);
        // Draw the health bar
        this.bar.fillRect(
            this.x - width / 2,
            this.y - 30,
            currentWidth,
            height
        );
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

