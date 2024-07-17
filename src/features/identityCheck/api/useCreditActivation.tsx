import { createStore } from 'libs/store/createStore'

type CreditState = {
  activationDate: Date | undefined
}

const defaultState: CreditState = {
  activationDate: undefined,
}

const actions = (set: (payload: CreditState) => void) => ({
  setActivationDate: (date: Date) => set({ activationDate: date }),
})

export const useCreditStore = createStore('credit', defaultState, actions, { persist: true })
