import { loadingStatusReducer } from '../reducer';
import { isLoadingSelector, errorSelector, hasErroredSelector } from '../selectors';
import { startLoading, setError, finishLoading } from '../actions';

describe('LoadingStatus store', () => {
  it('set the loading status to true to the store', () => {
    const initialState = loadingStatusReducer(undefined, { type: '@@INIT' });
    expect(isLoadingSelector('fetchFoos')({ loadingStatus: initialState })).toBe(false);

    const action = startLoading('fetchFoos');
    let state = loadingStatusReducer(initialState, action);
    let globalState = { loadingStatus: state };

    expect(isLoadingSelector('fetchFoos')(globalState)).toBe(true);
    expect(isLoadingSelector('whatever')(globalState)).toEqual(false);

    const finishAction = finishLoading('fetchFoos');
    state = loadingStatusReducer(state, finishAction);
    globalState = { loadingStatus: state };

    expect(isLoadingSelector('fetchFoos')(globalState)).toBe(false);
  });

  it('set the error in the store', () => {
    const error = 'This is an error!';

    const initialState = loadingStatusReducer(undefined, { type: '@@INIT' });
    expect(hasErroredSelector('fetchFoos')({ loadingStatus: initialState })).toBe(false);
    expect(errorSelector('fetchFoos')({ loadingStatus: initialState })).toBe(undefined);

    const action = setError('fetchFoos', error);
    const state = loadingStatusReducer(initialState, action);
    const globalState = { loadingStatus: state };

    expect(errorSelector('fetchFoos')(globalState)).toBe(error);
    expect(errorSelector('whatever')(globalState)).toEqual(undefined);

    expect(hasErroredSelector('fetchFoos')(globalState)).toBe(true);
    expect(hasErroredSelector('whatever')(globalState)).toEqual(false);
  });
});
