import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slices/counterSlice";
import itemSlice from "../slices/itemSlice";
import listSlice from "../slices/listSlice";
import userSlice from "../slices/usersSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

// Redux-Persist setup
// https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/

const persistConfig = {
  key: "root",
  storage,
};

//place reducers here
const rootReducer = combineReducers({
  item: itemSlice,
  list: listSlice,
  user: userSlice,
  counter: counterReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
