import { configureStore } from '@reduxjs/toolkit'

import { Dependencies } from './store.types'

export const initStore = (dependencies: Partial<Dependencies>) => {
  return configureStore({
    reducer: {
      // adapters
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
        serializableCheck: false,
      }),
    devTools: true,
  })
}
