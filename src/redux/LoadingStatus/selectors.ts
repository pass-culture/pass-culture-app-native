import { RootState } from '../rootReducer';

const loadingStatusSelector = (state: RootState, key: string) => state.loadingStatus[key];

export const isLoadingSelector = (key: string) => (state: RootState): boolean => {
  const loadingStatus = loadingStatusSelector(state, key);
  return loadingStatus ? loadingStatus.isLoading : false;
};

export const hasErroredSelector = (key: string) => (state: RootState): boolean => {
  const loadingStatus = loadingStatusSelector(state, key);
  return loadingStatus ? !!loadingStatus.error : false;
};

export const errorSelector = (key: string) => (state: RootState): string | undefined => {
  const loadingStatus = loadingStatusSelector(state, key);
  return loadingStatus ? loadingStatus.error : undefined;
};
