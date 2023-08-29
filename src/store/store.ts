import { combineReducers, configureStore } from "@reduxjs/toolkit";
import itemSlice from "../slices/itemSlice";
import listSlice from "../slices/listSlice";
import userSlice from "../slices/usersSlice";
import errorSlice from "../slices/errorSlice";

import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { WebStorage } from "redux-persist/lib/types";
import pageSlice from "../slices/pageSlice";

export function createPersistStorage(): WebStorage {
  const isServer = typeof window === "undefined";

  // Returns noop (dummy) storage.
  if (isServer) {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem() {
        return Promise.resolve();
      },
      removeItem() {
        return Promise.resolve();
      },
    };
  }

  return createWebStorage("local");
}

// Redux-Persist setup
const persistConfig = {
  key: "root",
  storage: createPersistStorage(),
};

//place reducers here
const rootReducer = combineReducers({
  error: errorSlice,
  item: itemSlice,
  list: listSlice,
  page: pageSlice,
  user: userSlice,
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
