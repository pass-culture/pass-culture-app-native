import { configureStore } from '@reduxjs/toolkit'

import { offerCalendarSlice } from 'features/offer/store/offer-calendar.slice'

import { Dependencies } from './store.types'

export const initStore = (dependencies: Partial<Dependencies>) => {
  return configureStore({
    reducer: {
      offerCalendar: offerCalendarSlice.reducer,
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
