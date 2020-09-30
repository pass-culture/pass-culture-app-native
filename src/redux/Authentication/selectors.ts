import { RootState } from '../rootReducer';

export const tokenSelector = (state: RootState): string | undefined => {
  return state.authentication.token;
};
