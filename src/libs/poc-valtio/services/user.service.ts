import { useEffect } from 'react'
// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'

import { serviceRegistry } from 'libs/poc-valtio/serviceRegistry'

type UserState = {
  firstname: string
  lastname: string
  birthdate: string | null
  isLoggedIn: boolean
}

export const userService = (getService: typeof serviceRegistry.get) => {
  const initialState: UserState = {
    firstname: '',
    lastname: '',
    birthdate: null,
    isLoggedIn: false,
  }
  const store = create<UserState>(() => initialState)

  return {
    store,
    getState: store.getState,
    login: async () => {
      store.setState({ isLoggedIn: true })
    },
    logout: () => {
      store.setState({ isLoggedIn: false })
    },
    callsCreditService: () => {
      getService('credit').incrementCredits()
    },
    useMyHook: () => {
      useEffect(() => {
        store.setState({ firstname: 'xavier' })
      }, [])
    },
  }
}
