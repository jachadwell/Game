import store from "@/store";
import { TInventoryItem } from "../Types/types";

export class QuestManager {

    constructor() {
        // Future function to load quest data from database
        // this.loadQuests();
    }

    findQuest(state: any, id: string) {
        // let state = store.getState();
        return state.quest.quests[id];
    }

    acceptQuest(id: string) {
        let state = store.getState();

        let quest = this.findQuest(state, id);
        if (!quest) {
            console.log(`CANNOT FIND QUEST ${id} IN STATE ${state}`);
            return;
        }

        store.dispatch({ type: "quest/updateQuestStatus", payload: { questId: id, status: "active" } })
    }

    completeQuest(id: string) {
        let state = store.getState();

        let quest = this.findQuest(state, id);
        if (!quest) {
            console.log(`CANNOT FIND QUEST ${id} IN STATE ${state}`);
            return;
        }

        /* 
        TODO:
        Check that player inventory has required quest items
            1. Get player inventory from state with selector
            2. Loop through quest.requirements.items and check with .every that player inventory contains item and enough quantity
            3. If no then log to console and return
            4. If yes then dispatch store reducers
        */

        store.dispatch({ type: "quest/updateQuestStatus", payload: { questId: id, status: "complete" } })
        quest.requirements.items.forEach((item: TInventoryItem) => {
            store.dispatch({ type: "player/removeFromInventory", payload: item })
        })
    }

}

const questManager = new QuestManager();

export default questManager