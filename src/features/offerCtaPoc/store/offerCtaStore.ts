import { createStore } from 'libs/store/createStore'

// LOCAL state (Zustand) — the booking modal visibility. Follows the project
// convention `createStore` (src/libs/store/createStore.ts). No `persist`:
// this is ephemeral page state.

type State = {
  isBookingModalVisible: boolean
}

const defaultState: State = {
  isBookingModalVisible: false,
}

const offerCtaStore = createStore({
  name: 'offer-cta',
  defaultState,
  actions: (set) => ({
    openBookingModal: () => set(() => ({ isBookingModalVisible: true })),
    closeBookingModal: () => set(() => ({ isBookingModalVisible: false })),
  }),
  selectors: {
    selectIsBookingModalVisible: () => (state) => state.isBookingModalVisible,
  },
})

export const offerCtaActions = offerCtaStore.actions

export const { useIsBookingModalVisible } = offerCtaStore.hooks
