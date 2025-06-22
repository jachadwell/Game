import Phaser from "phaser";

export class HealthBar {
    private bar: Phaser.GameObjects.Graphics;
    private health: number;

    constructor(scene: Phaser.Scene, x: number, y: number, initialHealth: number) {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.health = initialHealth

        scene.add.existing(this.bar)
    }
}