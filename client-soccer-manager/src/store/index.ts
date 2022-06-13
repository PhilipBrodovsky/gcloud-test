import { Group, Player } from "Entities";
import { AppDispatch } from "./index";
import { configureStore, combineReducers, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

interface CounterState {
	list: Player[];
}
const initialState: CounterState = {
	list: [],
};
const playersSlice = createSlice({
	name: "players",
	initialState,
	reducers: {
		set: (state, action: PayloadAction<any>) => {
			state.list = action.payload;
		},
	},
});

interface Cycle {}

interface GroupState {
	list: Group[];
	cycles: { [key: Group["id"]]: Cycle };
}
const initialStateGroup: GroupState = {
	list: [],
	cycles: {},
};

const groupsSlice = createSlice({
	name: "groups",
	initialState: initialStateGroup,
	reducers: {
		set: (state, action: PayloadAction<any>) => {
			state.list = action.payload;
		},

		setCycle: (state, action: PayloadAction<any>) => {
			state.list = action.payload;
		},
	},
});

const initialStateCycles: { map: { [key: string]: any } } = {
	map: {},
};
const cyclesSlice = createSlice({
	name: "cycles",
	initialState: initialStateCycles,
	reducers: {
		set: (state, action: PayloadAction<{ groupId: string; cycles: any[] }>) => {
			state.map[action.payload.groupId] = action.payload.cycles;
		},
	},
});

const gamesSLice = createSlice({
	name: "games",
	initialState: initialStateCycles,
	reducers: {
		set: (state, action: PayloadAction<{ cycleId: string; games: any[] }>) => {
			state.map[action.payload.cycleId] = action.payload.games;
		},
	},
});

export const store = configureStore({
	reducer: combineReducers({
		players: playersSlice.reducer,
		groups: groupsSlice.reducer,
		cycles: cyclesSlice.reducer,
		games: gamesSLice.reducer,
	}),
	middleware: [],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useActions = () => {
	const dispatch = useAppDispatch();
	const result = useMemo(() => {
		return {
			dispatch,
			players: playersSlice.actions,
			groups: groupsSlice.actions,
			games: gamesSLice.actions,
			cycles: cyclesSlice.actions,
		};
	}, []);
	return result;
};
