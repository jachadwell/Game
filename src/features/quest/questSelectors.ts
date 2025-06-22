import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectQuests = createSelector(
    (state: RootState) => state.quest.quests,
    (quests) => Object.values(quests)
)

export const makeSelectReadyQuestsByIds = (ids: string[]) =>
    createSelector([selectQuests], (quests) => {
        return quests.filter((quest: any) => ids.includes(String(quest.id)) && quest.status === "idle")
    })