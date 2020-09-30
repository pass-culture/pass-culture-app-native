import { action, ActionType } from 'typesafe-actions';

export const startLoading = (key: string) => action('LOADING_START', { key });
export const finishLoading = (key: string) => action('LOADING_END', { key });
export const setError = (key: string, error: string) => action('LOADING_ERROR', { key, error });

const actions = {
  startLoading,
  finishLoading,
  setError,
};

export type LoadingStatusAction = ActionType<typeof actions>;
