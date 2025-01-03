import { useEffect } from 'react'
import { proxy } from 'valtio'

import { serviceRegistry } from 'libs/poc-valtio/serviceRegistry'

type UserState = {
  firstname: string
  lastname: string
  birthdate: string | null
  isLoggedIn: boolean
}

export const userService = (getService: typeof serviceRegistry.get) => {
  const state = proxy<UserState>({
    firstname: '',
    lastname: '',
    birthdate: null,
    isLoggedIn: false,
  })

  return {
    state,
    actions: {
      login: async () => {
        state.isLoggedIn = true
      },
      logout: () => {
        state.isLoggedIn = false
      },
      callsCreditService: () => {
        getService('credit').actions.incrementCredits()
      },
      useMyHook: () => {
        useEffect(() => {
          state.firstname = 'xavier'
        }, [])
      },
    },
  }
}
