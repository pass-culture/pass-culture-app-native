import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type State = {
  address: string | null
}

const defaultState: State = { address: null }

const useAddressStore = createStore('profile-address', defaultState, { persist: true })

export const addressActions = createActions(useAddressStore, (set) => ({
  setAddress: (payload: string) => set({ address: payload }),
  resetAddress: () => set(defaultState),
}))

export const useAddress = () => useAddressStore((state) => state.address)
