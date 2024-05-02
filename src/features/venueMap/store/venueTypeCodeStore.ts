import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { VenueTypeCode } from 'libs/parsers/venueType'

type State = {
  venueTypeCode: VenueTypeCode | null
}
type Actions = {
  setVenueTypeCode: (payload: VenueTypeCode | null) => void
}

export type Store = State & { actions: Actions }

const useVenueTypeCodeStore = create<Store>()(
  devtools(
    (set) => ({
      venueTypeCode: null,
      actions: {
        setVenueTypeCode: (payload) => set({ venueTypeCode: payload }),
      },
    }),
    { enabled: process.env.NODE_ENV === 'development' }
  )
)

export const useVenueTypeCode = () => useVenueTypeCodeStore((state) => state.venueTypeCode)
export const useVenueTypeCodeActions = () => useVenueTypeCodeStore((state) => state.actions)
