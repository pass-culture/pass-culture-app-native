import { createStore } from 'libs/store/createStore'

type State = {
  address: string | null
}

const defaultState: State = { address: null }

const setActions = (set: (payload: State) => void) => ({
  setAddress: (payload: string) => set({ address: payload }),
  resetAddress: () => set(defaultState),
})

const useAddressStore = createStore<State, ReturnType<typeof setActions>>(
  'profile-address',
  defaultState,
  setActions,
  { persist: true }
)

export const useAddress = () => useAddressStore((state) => state.address)
export const useAddressActions = () => useAddressStore((state) => state.actions)
