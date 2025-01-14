import { createStore } from 'libs/store/createStore'

type State = {
  address: string | null
}

const defaultState: State = { address: null }

const addressStore = createStore({
  name: 'profile-address',
  defaultState,
  actions: (set) => ({
    setAddress: (address: string) => set({ address }),
    resetAddress: () => set(defaultState),
  }),
  options: { persist: true },
})

export const addressActions = addressStore.actions

export const useAddress = () => addressStore.useStore((state) => state.address)
