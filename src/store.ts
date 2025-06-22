import { useDispatch, useSelector } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./features/player/playerSlice";
import worldReducer from "./features/world/worldSlice";
import questReducer from "./features/quest/questSlice";

export const store = configureStore({
    reducer: {
        player: playerReducer,
        world: worldReducer,
        quest: questReducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export default store;