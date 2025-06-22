import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

import { selectQuests } from "../quest/questSelectors";

// const selectQuests = createSelector(
//     (state: RootState) => state.quest.quests,
//     (quests) => Object.values(quests)
// )

export const makeSelectQuestsByIds = (ids: string[]) =>
    createSelector([selectQuests], (worldQuests) => {
        return worldQuests.filter((quest: any) => ids.includes(String(quest.id)))
    })

// export const makeSelectReadyQuestsByIds = (ids: string[]) =>
//     createSelector([selectQuests], (quests) => {
//         return quests.filter((quest: any) => ids.includes(String(quest.id)) && quest.status === "idle")
//     })

export const makeSelectActiveQuests = () =>
    createSelector([selectQuests], (quests) => {
        return quests.filter((quest: any) => quest.status === "active");
    })

export const makeSelectActiveQuestsByIds = (ids: string[]) =>
    createSelector([selectQuests], (quests) => {
        return quests.filter((quest: any) => ids.includes(String(quest.id)) && quest.status === "active")
    })

export const makeSelectNpcById = (id: string) =>
    createSelector((state: RootState) => state.world.npcs, (npcs) => {
        return npcs[id]
    })

export const selectActiveQuests =
    createSelector(selectQuests, (quests) => {
        return quests.filter((quest: any) => quest.status === "active")
    })
