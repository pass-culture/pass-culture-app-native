import { createStore } from 'libs/store/createStore'

type CreditState = {
  activationDate: Date | undefined
}

const defaultState: CreditState = {
  activationDate: undefined,
}

const creditStore = createStore({
  name: 'credit',
  defaultState,
  options: { persist: true },
  actions: (set) => ({
    setActivationDate: (activationDate: Date) => set({ activationDate }),
  }),
})

export const creditActions = creditStore.actions
