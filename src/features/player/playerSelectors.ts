import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectPlayerInventory = createSelector(
    (state: RootState) => state, (state) => state.player.inventory);