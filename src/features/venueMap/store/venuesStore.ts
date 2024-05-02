import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { Venue } from 'features/venue/types'

type State = {
  venues: Venue[]
}
type Actions = {
  setVenues: (payload: Venue[]) => void
}

export type Store = State & { actions: Actions }

const useVenuesStore = create<Store>()(
  devtools(
    (set) => ({
      venues: [],
      actions: {
        setVenues: (payload) => set({ venues: payload }),
      },
    }),
    { enabled: process.env.NODE_ENV === 'development' }
  )
)

export const useVenues = () => useVenuesStore((state) => state.venues)
export const useVenuesActions = () => useVenuesStore((state) => state.actions)
