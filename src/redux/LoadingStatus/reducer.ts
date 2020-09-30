import { createReducer } from 'typesafe-actions';
import { LoadingStatusAction } from './actions';

export interface LoadingStatusState {
  [key: string]: {
    error?: string;
    isLoading: boolean;
  };
}

export const initialState = {};

export const loadingStatusReducer = createReducer<LoadingStatusState, LoadingStatusAction>(
  initialState,
  {
    LOADING_START: (state, action) => ({
      ...state,
      [action.payload.key]: {
        ...state[action.payload.key],
        isLoading: true,
        error: undefined,
      },
    }),
    LOADING_END: (state, action) => ({
      ...state,
      [action.payload.key]: {
        ...state[action.payload.key],
        isLoading: false,
        error: undefined,
      },
    }),
    LOADING_ERROR: (state, action) => ({
      ...state,
      [action.payload.key]: {
        ...state[action.payload.key],
        isLoading: false,
        error: action.payload.error,
      },
    }),
  }
);
