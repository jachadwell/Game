import { TQuest } from "@/game/Types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import quests from "./quests.json";

type TQuestSliceInitialState = {
    quests: Record<string, TQuest>
}

const initialState: TQuestSliceInitialState = {
    quests: quests.quests as Record<string, TQuest>
}

export const questSlice = createSlice({
    name: 'quest',
    initialState,
    reducers: {
        updateQuestStatus(state, action: PayloadAction<{ questId: string, status: "idle" | "active" | "complete" }>) {
            if (state.quests[action.payload.questId]) {
                state.quests[action.payload.questId] = {
                    ...state.quests[action.payload.questId],
                    status: action.payload.status
                }
            }
        },
        completeQuest(state, action: PayloadAction<{ questId: string }>) {
            if (!state.quests[action.payload.questId]) {
                // state.quests[action.payload.questId] = {
                //     ...state.quests[action.payload.questId],
                //     status: action.payload.status
                // }
                console.log(`QUEST ${action.payload.questId} DOES NOT EXIST IN STATE ${state}`);
                return;
            }
            state.quests[action.payload.questId] = {
                ...state.quests[action.payload.questId],
                status: "complete"
            }
        }
    }
})

export default questSlice.reducer;