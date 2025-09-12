import { createStore } from 'libs/store/createStore'

type State = { isCityReset: boolean }
const defaultState: State = { isCityReset: false }

const resetCityStore = createStore({
  name: 'profile-resetCityStore',
  defaultState,
  actions: (set) => ({
    setResetCity: (value: boolean) => set({ isCityReset: value }),
    resetCityFlag: () => set(defaultState),
  }),
  selectors: { selectIsResetCity: () => (state) => state.isCityReset },
  options: { persist: false },
})

export const resetCityActions = resetCityStore.actions
export const { useIsResetCity } = resetCityStore.hooks
