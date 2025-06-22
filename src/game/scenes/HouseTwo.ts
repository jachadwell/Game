import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { SceneLoader } from '../Classes/SceneLoader';

export default class HouseTwo extends Scene {

    constructor() {
        super({ key: 'HouseTwo' });
    }

    create(data: { spawn?: string }) {
        new SceneLoader({ scene: this, map: "basic-house-two-interrior", spawn: data.spawn })
        EventBus.emit('current-scene-ready', this);
    }
}