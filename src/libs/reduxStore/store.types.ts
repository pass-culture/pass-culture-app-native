import {
  Action,
  AnyAction,
  Store,
  ThunkAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { initReduxStore } from "./store";

export interface Dependencies {
  // gateways
}

export type AppState = ReturnType<
  ReturnType<typeof initReduxStore>["getState"]
>;

export type ReduxStore = Store<AppState> & {
  dispatch: ThunkDispatch<AppState, Dependencies, Action>;
};

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  Dependencies,
  AnyAction
>;

export type AppDispatch = ThunkDispatch<AppState, Dependencies, Action>;
