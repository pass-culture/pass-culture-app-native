import { createStore } from 'redux'; // @redux
import { persistStore } from 'redux-persist'; // @redux-persist

import { rootReducer } from './rootReducer'; // @redux-persist-sensitive

export const store = createStore(rootReducer);
// @ts-ignore persistStore doesn't infer store types,
// possible solution here: https://github.com/rt2zz/redux-persist/pull/1085
export const persistor = persistStore(store);
