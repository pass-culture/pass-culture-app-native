import { action, ActionType } from 'typesafe-actions';

export const setToken = (token: string) => action('AUTHENTICATION_SET_TOKEN', { token });

const actions = {
  setToken,
};

export type AuthenticationAction = ActionType<typeof actions>;
