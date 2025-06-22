import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TInventoryItem, TQuest } from "@/game/Types/types";
import world from "./world.json";

console.log("world:", world)

type TWorldSliceInitialState = {
    objects: Record<string, { inventory: TInventoryItem[] }>,
    npcs: Record<string, { quests?: string[] }>,
}

const initialState: TWorldSliceInitialState = {
    objects: world.objects as Record<string, { inventory: TInventoryItem[] }>,
    npcs: world.npcs as Record<string, { quests?: string[] }>
}

export const worldSlice = createSlice({
    name: 'world',
    initialState,
    reducers: {
        removeObjectInventoryItem(state, action: PayloadAction<{ id: string; removeItem: string }>) {
            if (!state.objects[action.payload.id]) {
                console.log(`OBJECT ${action.payload.id} DOES NOT EXIST IN WORLD`)
                return;
            }
            state.objects[action.payload.id].inventory =
                state.objects[action.payload.id].inventory
                    .filter((item: TInventoryItem) => {
                        item.name !== action.payload.removeItem
                    })
        },
        // updateQuestStatus(state, action: PayloadAction<{ questId: string, status: "idle" | "active" | "complete" }>) {
        //     if (state.quests[action.payload.questId]) {
        //         state.quests[action.payload.questId] = {
        //             ...state.quests[action.payload.questId],
        //             status: action.payload.status
        //         }
        //     }
        // }
    }
})

export default worldSlice.reducer;