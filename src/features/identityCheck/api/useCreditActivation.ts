import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type CreditState = {
  activationDate: Date | undefined
}

const defaultState: CreditState = {
  activationDate: undefined,
}

const useCreditStore = createStore({ name: 'credit', defaultState, options: { persist: true } })

export const creditActions = createActions(useCreditStore, (set) => ({
  setActivationDate: (activationDate: Date) => set({ activationDate }),
}))
