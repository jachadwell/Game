import { TMapNames } from "../Types/types";
import { Player } from "../GameObjects/Player";
import { Npc } from "../GameObjects/Npc";
import { Enemy } from "../GameObjects/Enemy";
import { EventBus } from "../EventBus";
import { Store } from "@reduxjs/toolkit";

type SceneLoaderProps = {
    scene: Phaser.Scene;
    map: TMapNames;
    spawn?: string;
};

export class SceneLoader {
    private scene: Phaser.Scene;
    private store: Store;
    private collisionLayer: Phaser.Tilemaps.TilemapLayer | null;
    private player: Player;

    constructor(data: SceneLoaderProps) {
        this.scene = data.scene;
        this.store = data.scene.registry.get("store");
        console.log("store:", this.store.getState());
        this.load(data);
    }

    load(data: SceneLoaderProps) {
        // this.keystrokes = this.scene.input.keyboard?.addKeys('E') as TKeyMapping;
        this.scene.input.keyboard?.on("keydown-TAB", () => {
            EventBus.emit("toggle-inventory");
        });
        const map = this.scene.make.tilemap({ key: data.map });
        if (!map) {
            console.log(`Error creating ${data.map} map!`);
            return;
        }
        this.scene.cameras.main.setZoom(1);
        this.scene.cameras.main.fadeIn(500, 0, 0, 0);
        this.scene.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );

        const houseTiles = map.addTilesetImage("pixel-houses", "house-tiles");
        const interriorTiles = map.addTilesetImage(
            "houses_interriors",
            "interrior-house-tiles"
        );
        const collisionTiles = map.addTilesetImage(
            "collision",
            "collision-tile"
        );
        const furnitureTiles = map.addTilesetImage(
            "furniture",
            "furniture-tiles"
        );
        const bridgesFencesTiles = map.addTilesetImage(
            "outside-bridges-fences",
            "outside-bridges-fences-tiles"
        );
        const groundTiles = map.addTilesetImage(
            "outside-ground",
            "outside-ground-tiles"
        );
        const hillTiles = map.addTilesetImage(
            "outside-hills",
            "outside-hill-tiles"
        );
        const outsidePropTiles = map.addTilesetImage(
            "outside-props",
            "outside-props-tiles"
        );
        const treeTiles = map.addTilesetImage("trees", "tree-tiles");

        map.createLayer(
            "world",
            [groundTiles] as Phaser.Tilemaps.Tileset[],
            0,
            0
        );
        map.createLayer(
            "world-props",
            [
                bridgesFencesTiles,
                outsidePropTiles,
                treeTiles,
            ] as Phaser.Tilemaps.Tileset[],
            0,
            0
        );
        map.createLayer(
            "background",
            [
                houseTiles,
                interriorTiles,
                hillTiles,
                furnitureTiles,
            ] as Phaser.Tilemaps.Tileset[],
            0,
            0
        );
        map.createLayer(
            "foreground",
            [
                houseTiles,
                interriorTiles,
                furnitureTiles,
                bridgesFencesTiles,
                treeTiles,
            ] as Phaser.Tilemaps.Tileset[],
            0,
            0
        )?.setDepth(1);

        const collisionLayer = map
            .createLayer(
                "collision",
                this.scene.physics.getConfig().debug
                    ? (collisionTiles as Phaser.Tilemaps.Tileset)
                    : [],
                0,
                0
            )
            ?.setDepth(3);
        if (collisionLayer === null) {
            console.log("ERROR creating collision layer");
            return;
        }
        collisionLayer?.setCollisionByProperty({ collides: true }, true, true);
        this.collisionLayer = collisionLayer as Phaser.Tilemaps.TilemapLayer;

        const doorsLayerObjects = map.getObjectLayer("doors")?.objects;
        const doorTriggers = doorsLayerObjects?.filter(
            (obj) => obj.type === "doorTrigger"
        );
        const doorSpawns = doorsLayerObjects?.filter(
            (obj) => obj.type === "doorSpawn"
        );
        const spawn = getSpawnPoint(doorSpawns, data.spawn);

        const teleportTriggers = doorsLayerObjects?.filter(
            (obj) => obj.type === "teleportTrigger"
        );
        const teleportSpawns = doorsLayerObjects?.filter(
            (obj) => obj.type === "teleportSpawn"
        );

        const npcObjects = map.getObjectLayer("npcs")?.objects;
        const npcSpawns = npcObjects?.filter((obj) => obj.type === "npcSpawn");

        const enemyObjects = map.getObjectLayer("enemies")?.objects;
        const enemySpawns = enemyObjects?.filter(
            (obj) => obj.type === "enemySpawn"
        );

        const objects = map.getObjectLayer("objects")?.objects;

        this.player = new Player({
            scene: this.scene,
            x: spawn ? spawn.x! + spawn.width! / 2 : map.widthInPixels / 2,
            y: spawn ? spawn.y! + spawn.height! / 2 : map.heightInPixels / 2,
        });
        this.scene.cameras.main.startFollow(this.player);
        this.scene.physics.add.collider(this.player, this.collisionLayer);

        doorTriggers?.forEach((trigger) => {
            const triggerZone = this.scene.add.rectangle(
                trigger.x,
                trigger.y,
                trigger.width,
                trigger.height,
                this.scene.physics.getConfig().debug ? 0x0000ff : undefined,
                this.scene.physics.getConfig().debug ? 0.5 : undefined
            );
            triggerZone.setOrigin(0, 0);
            this.scene.physics.add.existing(triggerZone, true);

            this.scene.physics.add.overlap(this.player, triggerZone, () => {
                const nextSpawn = getObjectCustomPropertyValue(
                    trigger,
                    "doorId"
                );
                const nextScene = getObjectCustomPropertyValue(
                    trigger,
                    "scene"
                );
                this.scene.scene.start(nextScene, { spawn: nextSpawn });
            });
        });

        teleportTriggers?.forEach((trigger) => {
            const triggerZone = this.scene.add.rectangle(
                trigger.x,
                trigger.y,
                trigger.width,
                trigger.height,
                this.scene.physics.getConfig().debug ? 0x0000ff : undefined,
                this.scene.physics.getConfig().debug ? 0.5 : undefined
            );
            triggerZone.setOrigin(0, 0);
            this.scene.physics.add.existing(triggerZone, true);

            this.scene.physics.add.overlap(this.player, triggerZone, () => {
                const teleportId = getObjectCustomPropertyValue(
                    trigger,
                    "teleportId"
                );
                const spawn = teleportSpawns?.find(
                    (spawn) =>
                        getObjectCustomPropertyValue(spawn, "teleportId") ===
                        teleportId
                );
                this.player.setPosition(
                    spawn?.x! + spawn?.width! / 2,
                    spawn?.y! + spawn?.height! / 2
                );
            });
        });

        npcSpawns?.forEach((spawn) => {
            const npc = new Npc({
                scene: this.scene,
                player: this.player,
                x: spawn.x!,
                y: spawn.y!,
                id: getObjectCustomPropertyValue(spawn, "id"),
                dialog: getObjectCustomPropertyValue(spawn, "dialog"),
            });
            this.scene.physics.add.collider(this.player, npc);
        });

        enemySpawns?.forEach((spawn) => {
            const enemy = new Enemy({
                scene: this.scene,
                player: this.player,
                gameobject: spawn,
            });
            this.scene.physics.add.collider(this.player, enemy);
        });

        objects?.forEach((object) => {
            const objectId = object.properties.find(
                (prop: any) => prop.name === "id"
            ).value;

            const interactableZone = this.scene.add.rectangle(
                object.x,
                object.y,
                object.width,
                object.height,
                this.scene.physics.getConfig().debug ? 0x0000ff : undefined,
                this.scene.physics.getConfig().debug ? 0.5 : undefined
            );
            interactableZone.setOrigin(0, 0);

            const hitAreaWidth = interactableZone.width;
            const hitAreaHeight = interactableZone.height;
            const hitArea = new Phaser.Geom.Rectangle(
                interactableZone.width - hitAreaWidth,
                interactableZone.height - hitAreaHeight,
                hitAreaWidth,
                hitAreaHeight
            );

            const interactionDistance = 100;

            interactableZone
                .setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
                .on("pointerdown", (pointer: any) => {
                    const distance = Phaser.Math.Distance.Between(
                        interactableZone.x,
                        interactableZone.y,
                        this.player.x,
                        this.player.y
                    );
                    if (distance <= interactionDistance) {
                        const stateObject =
                            this.store.getState().world.objects[objectId];
                        EventBus.emit("show-object-inventory", {
                            x: pointer.x,
                            y: pointer.y,
                            object: {
                                id: objectId,
                                inventory: stateObject.inventory,
                            },
                        });
                    }
                })
                .on("pointerover", () => {
                    this.scene.input.setDefaultCursor("pointer");
                })
                .on("pointerout", () => {
                    this.scene.input.setDefaultCursor("default");
                });
        });

        setTimeout(() => {
            console.log("Launching scene!");
            this.scene.scene.pause()
            this.scene.scene.launch('Arena');
            this.scene.scene.bringToTop('Arena');
        }, 3000);
    }
}

export function getObjectCustomPropertyValue(
    object: Phaser.Types.Tilemaps.TiledObject,
    property: string
) {
    return object.properties.find((prop: any) => prop.name === property)?.value;
}

export function getDoorTriggerDoor(
    doors: Phaser.Types.Tilemaps.TiledObject[] | undefined,
    doorId: string
) {
    if (doors === undefined) {
        return null;
    }
    return doors?.find((d) => {
        return d.properties?.find(
            (property: any) =>
                property.name === "id" && property.value === doorId
        );
    });
}

export function getSpawnPoint(
    spawns: Phaser.Types.Tilemaps.TiledObject[] | undefined,
    name: string | undefined
) {
    if (spawns === undefined || name === undefined) {
        return null;
    }
    return spawns.find((spawn) => {
        return getObjectCustomPropertyValue(spawn, "doorId") === name;
    });
}

