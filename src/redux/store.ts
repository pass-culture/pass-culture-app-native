import { createStore, applyMiddleware } from 'redux'; // @redux
import { composeWithDevTools } from 'redux-devtools-extension'; // @redux
import { persistStore } from 'redux-persist'; // @redux-persist
import { middlewares, sagaMiddleware } from './middlewares';

import { rootReducer } from './rootReducer'; // @redux-persist-sensitive
import { rootSaga } from './sagas'; // @redux

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));
// @ts-ignore persistStore doesn't infer store types,
// possible solution here: https://github.com/rt2zz/redux-persist/pull/1085
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
