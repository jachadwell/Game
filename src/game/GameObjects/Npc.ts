import Phaser from "phaser";
import { EventBus } from "../EventBus";
import { Player } from "./Player";
import store from "@/store";
import { Unsubscribe } from "@reduxjs/toolkit";

import { TInventoryItem, TQuest, TPlayerInventory } from "../Types/types";
import {
    makeSelectActiveQuestsByIds,
    makeSelectNpcById
} from "@/features/world/worldSelectors";
import { selectPlayerInventory } from "@/features/player/playerSelectors";
import { makeSelectReadyQuestsByIds } from "@/features/quest/questSelectors";


type NpcConfig = {
    scene: Phaser.Scene;
    player: Player
    x: number;
    y: number;
    id: string;
    dialog?: string | null;
    frame?: number;
}

export class Npc extends Phaser.Physics.Arcade.Sprite {

    private id: string;
    private quests: [] = [];
    private exclamation: Phaser.Physics.Arcade.Sprite;
    private questionMark: Phaser.Physics.Arcade.Sprite;
    private unsubscribe: Unsubscribe;

    constructor(config: NpcConfig) {
        const { id, scene, player } = config
        super(scene, config.x, config.y, 'dude');

        this.id = id;

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.setScale(1.5)
        this.play({ key: "idle-npc" })

        this.body?.setSize(this.width * 0.3, this.height * 0.3);
        this.body?.setOffset(5, 15)
        this.setDepth(1)

        this.exclamation = scene.physics.add.sprite(this.x, this.y - 45, '')
        this.exclamation.play({ key: "quest" })
        this.exclamation.setDepth(1)
        this.exclamation.setVisible(false);

        this.questionMark = scene.physics.add.sprite(this.x, this.y - 45, '')
        this.questionMark.play({ key: "questComplete" })
        this.questionMark.setDepth(1)
        this.questionMark.setVisible(false);

        const selectNpcById = makeSelectNpcById(id);
        const npc: any = selectNpcById(store.getState());
        if (!npc) {
            console.log(`npc ${id} DOES NOT EXIST IN STATE`)
            return;
        }
        const state = store.getState();
        const selectReadyQuests = makeSelectReadyQuestsByIds(npc.quests);
        const selectActiveQuests = makeSelectActiveQuestsByIds(npc.quests);
        const playerInventory = selectPlayerInventory(state);
        this.handleUpdateNpc(selectReadyQuests(state), selectActiveQuests(state), playerInventory)

        this.unsubscribe = store.subscribe(() => {
            const state = store.getState();
            this.handleUpdateNpc(
                selectReadyQuests(state),
                selectActiveQuests(state),
                selectPlayerInventory(state)
            )
        })

        const hitAreaWidth = this.width * 0.3;
        const hitAreaHeight = this.height * 0.5;
        const hitArea = new Phaser.Geom.Rectangle(
            this.width / 2 - hitAreaWidth / 2,
            this.height / 2 - hitAreaHeight / 2,
            hitAreaWidth,
            hitAreaHeight
        );

        const interactionDistance = 50;

        this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                const state = store.getState();
                const hasReadyQuest = selectReadyQuests(state).length > 0;
                console.log("selectReadyQuests:", selectReadyQuests(state))
                const readyQuestId = selectReadyQuests(state)[0].id;
                const hasCompleteQuest = this.hasCompleteQuest(selectActiveQuests(state), selectPlayerInventory(state));

                console.log("hasReadyQuest:", hasReadyQuest);
                console.log("readyQuestId:", readyQuestId)

                const distance = Phaser.Math.Distance.Between(
                    this.x, this.y,
                    player.x, player.y
                );
                console.log("distance:", distance)
                if (distance <= interactionDistance) {
                    console.log("Adding stick to inventory!")
                    store.dispatch({ type: "player/addToInventory", payload: { name: "stick" } })
                    EventBus.emit("toggle-dialog",
                        {
                            dialog: config.dialog,
                            hasReadyQuest: hasReadyQuest,
                            readyQuestId: readyQuestId,
                            hasCompleteQuest: hasCompleteQuest
                        })
                }
            })
            .on('pointerover', () => {
                scene.input.setDefaultCursor('pointer');
            })
            .on('pointerout', () => {
                scene.input.setDefaultCursor('default');
            })

        scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        });
    }

    handleUpdateNpc(readyQuests: any, activeQuests: any, pInventory: Record<string, TInventoryItem>) {

        this.exclamation.setVisible(false);
        this.questionMark.setVisible(false)

        if (readyQuests.length > 0) {
            this.exclamation.setVisible(true);
            return;
        }
        if (activeQuests.length > 0) {
            activeQuests.filter((quest: TQuest) => {
                return quest.requirements?.items.every((item) => {
                    if (pInventory[item.name] && pInventory[item.name].quantity >= item.quantity) {
                        this.questionMark.setVisible(true)
                    }
                })
            })
        }
    }

    hasCompleteQuest(activeQuests: any, pInventory: Record<string, TInventoryItem>) {
        let hasCompleteQuest = false;
        if (activeQuests.length > 0) {
            activeQuests.filter((quest: TQuest) => {
                return quest.requirements?.items.every((item) => {
                    if (pInventory[item.name] && pInventory[item.name].quantity >= item.quantity) {
                        hasCompleteQuest = true;
                    }
                })
            })
        }
        return hasCompleteQuest;
    }

    update(...args: any[]): void {

    }

    destroy(fromScene?: boolean): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

}