import { combineReducers } from 'redux'; // @redux
import { Reducer } from 'typesafe-actions';
import { loadingStatusReducer, LoadingStatusState } from './LoadingStatus/reducer'; // @redux
import { authenticationReducer, AuthenticationState } from './Authentication/reducer'; // @redux
import { LoadingStatusAction } from './LoadingStatus'; // @redux
import { AuthenticationAction } from './Authentication'; // @redux
import { sensitivePersist, localStoragePersist } from './persisters'; //@redux-persist-sensitive-storage

export interface RootState {
  loadingStatus: LoadingStatusState;
  authentication: AuthenticationState;
}

export type RootReducer = {
  loadingStatus: Reducer<LoadingStatusState, LoadingStatusAction>;
  authentication: Reducer<AuthenticationState, AuthenticationAction>;
};

export const rootReducer = combineReducers({
  loadingStatus: localStoragePersist('loadingStatus', loadingStatusReducer, []),
  authentication: sensitivePersist('authentication', authenticationReducer),
});
