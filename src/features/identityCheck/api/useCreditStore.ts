import { createActions } from 'libs/store/createActions'
import { createConfiguredStore } from 'libs/store/createConfiguredStore'

type CreditState = {
  activationDate: Date | undefined
}

const defaultState: CreditState = {
  activationDate: undefined,
}

const useCreditStore = createConfiguredStore({
  name: 'credit',
  defaultState,
  options: { persist: true },
})

export const creditActions = createActions(useCreditStore, (set) => ({
  setActivationDate: (activationDate: Date) => set({ activationDate }),
}))
