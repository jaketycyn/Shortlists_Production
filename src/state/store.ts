import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    lists: listsReducer,
    items: itemsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {lists: ListsState, items: ItemsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// from: https://redux.js.org/tutorials/typescript-quick-start
//Define Typed Hooks

// While it's possible to import the RootState and AppDispatch types into each component, it's better to create typed versions of the useDispatch and useSelector hooks for usage in your application. This is important for a couple reasons:

// For useSelector, it saves you the need to type (state: RootState) every time
// For useDispatch, the default Dispatch type does not know about thunks. In order to correctly dispatch thunks, you need to use the specific customized AppDispatch type from the store that includes the thunk middleware types, and use that with useDispatch. Adding a pre-typed useDispatch hook keeps you from forgetting to import AppDispatch where it's needed.

// Since these are actual variables, not types, it's important to define them in a separate file such as app/hooks.ts, not the store setup file. This allows you to import them into any component file that needs to use the hooks, and avoids potential circular import dependency issues.
