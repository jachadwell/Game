import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { SceneLoader } from '../Classes/SceneLoader';

export default class Start extends Scene {

    constructor() {
        super({ key: 'Start' });
    }

    create(data: { spawn?: string }) {
        new SceneLoader({ scene: this, map: "basic-house", spawn: data.spawn })
        EventBus.emit('current-scene-ready', this);
    }
}