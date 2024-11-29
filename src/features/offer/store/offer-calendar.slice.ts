import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { getDates } from 'shared/date/getDates'

interface CounterState {
  dates: Date[]
  selectedDate: Date
  disabledDates: Date[]
}

const next15Dates = getDates(new Date(), 15)

const initialState: CounterState = {
  dates: next15Dates,
  disabledDates: [],
  selectedDate: next15Dates[0],
}

export const offerCalendarSlice = createSlice({
  name: 'offer-calendar',
  initialState,
  reducers: {
    setState(state, action: PayloadAction<Partial<CounterState>>) {
      state = { ...state, ...action.payload }
    },
  },
})
