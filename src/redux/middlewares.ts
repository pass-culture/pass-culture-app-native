import createSagaMiddleware from 'redux-saga'; // @redux

export const sagaMiddleware = createSagaMiddleware();

export const middlewares = [sagaMiddleware];
