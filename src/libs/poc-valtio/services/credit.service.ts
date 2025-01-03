import { proxy } from 'valtio'

import { serviceRegistry } from 'libs/poc-valtio/serviceRegistry'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'

type CreditState = {
  activationDate: Date | undefined
  currentCredit: number
}

export const creditService = (_getService: typeof serviceRegistry.get) => {
  const state = proxy<CreditState>({ activationDate: undefined, currentCredit: 0 })

  return {
    state,
    actions: {
      useFetchCredits: () => {
        useAvailableCredit()
      },
      incrementCredits: () => {
        state.currentCredit += 1
      },
    },
  }
}
