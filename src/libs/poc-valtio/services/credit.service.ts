// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'

import { serviceRegistry } from 'libs/poc-valtio/serviceRegistry'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'

type CreditState = {
  activationDate: Date | undefined
  currentCredit: number
}

export const creditService = (_getService: typeof serviceRegistry.get) => {
  const initialState: CreditState = { activationDate: undefined, currentCredit: 0 }
  const store = create<CreditState>(() => initialState)

  return {
    store,
    getState: store.getState,
    useFetchCredits: () => {
      useAvailableCredit()
    },
    incrementCredits: () => {
      store.setState((state) => ({ ...state, currentCredit: state.currentCredit + 1 }))
    },
  }
}
