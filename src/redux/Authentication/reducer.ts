import { createReducer } from 'typesafe-actions';
import { AuthenticationAction } from './actions';

export interface AuthenticationState {
  token?: string;
}

export const initialState = {};

export const authenticationReducer = createReducer<AuthenticationState, AuthenticationAction>(
  initialState,
  {
    AUTHENTICATION_SET_TOKEN: (state, action) => ({
      ...state,
      token: action.payload.token,
    }),
  }
);
