import { createActions } from 'libs/store/createActions'
import { createConfiguredStore } from 'libs/store/createConfiguredStore'

type State = {
  address: string | null
}

const defaultState: State = { address: null }

const useAddressStore = createConfiguredStore({
  name: 'profile-address',
  defaultState,
  options: { persist: true },
})

export const addressActions = createActions(useAddressStore, (set) => ({
  setAddress: (address: string) => set({ address }),
  resetAddress: () => set(defaultState),
}))

export const useAddress = () => useAddressStore((state) => state.address)
