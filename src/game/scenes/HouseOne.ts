import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { SceneLoader } from '../Classes/SceneLoader';

export default class HouseOne extends Scene {

    constructor() {
        super({ key: 'HouseOne' });
    }

    create(data: { spawn?: string }) {
        new SceneLoader({ scene: this, map: "basic-house-one-interrior", spawn: data.spawn })
        EventBus.emit('current-scene-ready', this);
    }
}