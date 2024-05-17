import { createStore } from 'libs/store/createStore'

type State = {
  address: string | null
}
type Actions = {
  setAddress: (payload: string) => void
  resetAddress: () => void
}

const useAddressStore = createStore<State, Actions>(
  'profile-address',
  { address: null },
  (set) => ({
    setAddress: (payload) => set({ address: payload }),
    resetAddress: () => set({ address: null }),
  }),
  { persist: true }
)

export const useAddress = () => useAddressStore((state) => state.address)
export const useAddressActions = () => useAddressStore((state) => state.actions)
