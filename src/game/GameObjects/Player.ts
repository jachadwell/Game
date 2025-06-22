import Phaser from "phaser";
import { EventBus } from '../EventBus';
import { getObjectCustomPropertyValue } from "../Classes/SceneLoader";

type PlayerConfig = {
    scene: Phaser.Scene;
    x: number;
    y: number;
    frame?: number;
}

type KeyMapping = {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key,
    TAB: Phaser.Input.Keyboard.Key,
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors;
    private keystrokes: KeyMapping | undefined

    constructor(config: PlayerConfig) {
        const { scene } = config
        super(scene, config.x, config.y, 'dude');

        this.cursors = scene.input.keyboard?.createCursorKeys();
        this.keystrokes = scene.input.keyboard?.addKeys('W,S,A,D,TAB') as KeyMapping;

        scene.add.existing(this);
        scene.physics.add.existing(this)

        // Prevent player from leaving screen
        this.setCollideWorldBounds(true);
        this.setScale(1.5)
        this.play({ key: "idle" })

        this.body?.setSize(this.width * 0.2, this.height * 0.35);
        this.body?.setOffset(25, 20);

        scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        });

        scene.input?.keyboard?.on('keydown', () => {
            EventBus.emit("toggle-dialog-off")
        })

        // Attack logic
        scene.input.on('gameobjectdown', (pointer: any, gameObject: any) => {
            if (Phaser.Math.Distance.Between(this.x, this.y, gameObject.x, gameObject.y) > 60) {
                return;
            }
            const enemyId = getObjectCustomPropertyValue(gameObject.gameobject, "enemyId");
            EventBus.emit(enemyId, 'attack', 1);
        })
    }

    update() {
        this.setVelocityX(0);
        this.setVelocityY(0);

        if (this.cursors?.left.isDown || this.keystrokes?.A.isDown) {
            this.setVelocityX(-160);
        } else if (this.cursors?.right.isDown || this.keystrokes?.D.isDown) {
            this.setVelocityX(160);
        }
        if (this.cursors?.up.isDown || this.keystrokes?.W.isDown) {
            this.setVelocityY(-160);
        } else if (this.cursors?.down.isDown || this.keystrokes?.S.isDown) {
            this.setVelocityY(160);
        }

        const velocity = this.body?.velocity;
        if (!velocity) {
            return;
        }

        // Stop the current animation if the player is idle
        if (velocity.x === 0 && velocity.y === 0) {
            this.play('idle', true); // Replace 'idle' with your idle animation key
        } else {
            // Determine the direction and play the appropriate animation
            if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
                // Horizontal movement
                if (velocity.x > 0) {
                    this.play('walk-right', true); // Replace with your right-walking animation key
                } else {
                    this.play('walk-left', true); // Replace with your left-walking animation key
                }
            } else {
                // Vertical movement
                if (velocity.y > 0) {
                    this.play('walk-down', true); // Replace with your down-walking animation key
                } else {
                    this.play('walk-up', true); // Replace with your up-walking animation key
                }
            }
        }
    }
}