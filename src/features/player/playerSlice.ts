import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TInventoryItem, TPlayerInventory } from "@/game/Types/types";

type TPlayerSliceInitialState = {
    attributes: {
        health: number;
    }
    inventory: TPlayerInventory;
}

const initialState: TPlayerSliceInitialState = {
    attributes: {
        health: 100
    },
    inventory: {},
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        addToInventory: (state, action: PayloadAction<{ name: string; quantity?: number }>) => {
            const item = action.payload;
            if (state.inventory[item.name]) {
                state.inventory[item.name] = {
                    ...state.inventory[item.name],
                    quantity: state.inventory[item.name].quantity + (item.quantity ?? 1)
                }
            } else {
                state.inventory[item.name] = { name: item.name, quantity: item.quantity ?? 1 }
            }
        },
        removeFromInventory: (state, action: PayloadAction<{ name: string; quantity: number }>) => {
            const item = action.payload;
            state.inventory[item.name] = {
                ...state.inventory[item.name],
                quantity: state.inventory[item.name].quantity - item.quantity
            }
        }
    }
})

export const { addToInventory } = playerSlice.actions;

export default playerSlice.reducer;