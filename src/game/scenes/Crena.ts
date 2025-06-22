import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Player } from '../GameObjects/Player';
import { Enemy } from '../GameObjects/Enemy';

export default class Arena extends Scene {

    constructor() {
        super({ key: 'Arena' });
    }

    preload() {
        // This is only needed here because this file comes before Boot.ts
        // this.scene.start('Preloader');
    }

    create() {
        const map = this.scene.scene.make.tilemap({ key: 'arena' });
        if (!map) {
            console.log(`Error creating arena map!`);
            return;
        }
        this.scene.scene.cameras.main.fadeIn(500, 0, 0, 0);

        const groundTiles = map.addTilesetImage(
            "outside-ground",
            "outside-ground-tiles"
        );
        const hillTiles = map.addTilesetImage(
            "outside-hills",
            "outside-hill-tiles"
        );
        map.createLayer(
            "world",
            [groundTiles, hillTiles] as Phaser.Tilemaps.Tileset[],
            0,
            0
        );

        // Center arena in the middle of the screen
        const center = this.physics.add.staticBody(map.widthInPixels / 2, map.heightInPixels / 2);
        this.scene.scene.cameras.main.startFollow(center);

        const spawns = map.getObjectLayer("spawns")?.objects;
        const playerSpawns = spawns?.filter((obj) => obj.type === "playerSpawn");
        const enemySpawns = spawns?.filter((obj) => obj.type === "enemySpawn");
        console.log("playerSpawns:", playerSpawns, "enemySpawns:", enemySpawns);

        const player = new Player({
            scene: this,
            x: playerSpawns![0].x!,
            y: playerSpawns![0].y!,
            disableMovement: true
        });
        const enemy = this.physics.add.staticSprite(enemySpawns![0].x!, enemySpawns![0].y!, 'shroom-idle');
        enemy.play("mushroom-idle")


        EventBus.emit('current-scene-ready', this);
    }
}