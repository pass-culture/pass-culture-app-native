import { proxy } from 'valtio'

import { serviceRegistry } from 'libs/poc-valtio/serviceRegistry'

type CreditState = {
  activationDate: Date | undefined
  currentCredit: number
}

// faire un createService pour donner un template
export const creditService = (getService: typeof serviceRegistry.get) => {
  const state = proxy<CreditState>({ activationDate: undefined, currentCredit: 0 })

  return {
    state,
    actions: {
      useFetchCredits: () => {},
      incrementCredits: () => {},
    },
  }
}
