import { AUTO, Game } from 'phaser';
import store from '../store';

const sceneModules = import.meta.glob('./Scenes/*.ts', { eager: true });
const scenes = Object.values(sceneModules).map((module: any) => module.default);

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    // width: "97%",
    width: "100%",
    height: "100%",
    parent: 'game-container',
    // backgroundColor: '#080E16',
    scene: scenes,
    callbacks: {
        preBoot: (game) => {
            game.registry.set("store", store);
        },
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                x: 0,
                y: 0
            },
            // Set this to true to see player collider
            debug: false
        }
    },
    input: { keyboard: true, mouse: true },
    pixelArt: true,
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
