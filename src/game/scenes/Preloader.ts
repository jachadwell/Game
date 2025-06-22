import { Scene } from 'phaser';

export default class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {

    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.spritesheet('animations',
            'animations.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.spritesheet('exclamation',
            'exclamation.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('questionMark',
            'question_mark.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('villager',
            'villager.png',
            { frameWidth: 36, frameHeight: 36 }
        );
        this.load.spritesheet('shroom',
            'mushroom/Sprites/Shoom_Idle.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        this.load.image('collision-tile', 'collision.png');
        this.load.image('house-tiles', 'houses.png');
        this.load.image('interrior-house-tiles', 'houses_interriors.png');
        this.load.image('furniture-tiles', 'Fantasy Lands/_PNG/Interriors/Furnitures/FL_Houses_int_FurnituresA.png');
        this.load.image('outside-bridges-fences-tiles', 'Fantasy Lands/_PNG/FLSET1_bridges and fences.png');
        this.load.image('outside-ground-tiles', 'Fantasy Lands/_PNG/FLSET1_ground.png');
        this.load.image('outside-hill-tiles', 'Fantasy Lands/_PNG/FLSET1_hills.png');
        this.load.image('outside-props-tiles', 'Fantasy Lands/_PNG/FLSET1_ground_dec_props.png');
        this.load.image('tree-tiles', 'Fantasy Lands/_PNG/Anim/Trees/Tree_A_v1.png');

        // this.load.image('exclamation', 'exclamation.png');

        this.load.tilemapTiledJSON('basic-house', 'BasicHouse/Basic-House.json');
        this.load.tilemapTiledJSON('basic-house-one-interrior', 'BasicHouse/Basic-House-Interrior.json');
        this.load.tilemapTiledJSON('basic-house-two-interrior', 'BasicHouse/Basic-House-Interrior2.json');
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.createAnimations();

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Start');
    }

    createAnimations() {
        this.anims.create({
            key: 'idle-npc',
            frames: this.anims.generateFrameNumbers('animations', { frames: [0] }),
            frameRate: 1,
            repeat: -1
        })

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('villager', { frames: [0, 1, 2, 3, 4] }),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('animations', { frames: [32, 33, 34, 35, 36, 37] }),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('animations', { frames: [40, 41, 42, 43, 44, 45] }),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('animations', { frames: [48, 49, 50, 51, 52, 53] }),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('animations', { frames: [56, 57, 58, 59, 60, 61] }),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'quest',
            frames: this.anims.generateFrameNumbers('exclamation', { frames: [0, 1, 2, 3] }),
            frameRate: 2,
            repeat: -1
        })
        this.anims.create({
            key: 'questComplete',
            frames: this.anims.generateFrameNumbers('questionMark', { frames: [0, 1, 2, 3] }),
            frameRate: 2,
            repeat: -1
        })
        this.anims.create({
            key: 'mushroom-idle',
            frames: this.anims.generateFrameNumbers('shroom', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 6,
            repeat: -1
        })
    }
}
