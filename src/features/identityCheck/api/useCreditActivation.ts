import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type CreditState = {
  activationDate: Date | undefined
}

const defaultState: CreditState = {
  activationDate: undefined,
}

export const useCreditStore = createStore('credit', defaultState, { persist: true })

export const creditActions = createActions(useCreditStore, (set) => ({
  setActivationDate: (date: Date) => set({ activationDate: date }),
}))
