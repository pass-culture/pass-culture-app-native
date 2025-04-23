import { createStore } from 'libs/store/createStore'

type State = { offerId: number | null }

const defaultState: State = { offerId: null }

const freeOfferIdStore = createStore({
  name: 'free-offer-id',
  defaultState,
  actions: (set) => ({
    setFreeOfferId: (offerId: number) => set({ offerId }),
    resetFreeOfferId: () => set(defaultState),
  }),
  selectors: { selectFreeOfferId: () => (state) => state.offerId },
  options: { persist: true },
})

export const freeOfferIdActions = freeOfferIdStore.actions
export const { useFreeOfferId } = freeOfferIdStore.hooks
