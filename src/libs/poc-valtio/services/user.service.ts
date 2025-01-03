import { proxy } from 'valtio'

import { api } from 'api/api'
import { useSignUp } from 'features/auth/api/useSignUp'
import { serviceRegistry } from 'libs/poc-valtio/serviceRegistry'

type UserState = {
  firstname: string
  lastname: string
  birthdate: string | null
  isLoggedIn: boolean
}

export interface Storage {
  getItem: (key: string) => Promise<any>
  setItem: (key: string, value: string) => Promise<void>
}

interface Dependencies {
  storage: Storage
}

export const userService = (getService: typeof serviceRegistry.get, dependencies: Dependencies) => {
  const state = proxy<UserState>({
    firstname: '',
    lastname: '',
    birthdate: null,
    isLoggedIn: false,
  })

  return {
    state,
    actions: {
      login: async (email: string, password: string) => {
        try {
          const result = await api.postNativeV1Signin()
          dependencies.storage.setItem('user-email', email)
          state.isLoggedIn = true
        } catch (e) {
          return e
        }
      },
      logout: () => {
        state.isLoggedIn = false
      },
      useSignUp: async ({
        email,
        password,
        birthdate,
      }: {
        email: string
        password: string
        firstname: string
        lastname: string
        birthdate: string
      }) => {
        const signUpApiCall = useSignUp()
        await signUpApiCall({ birthdate, email, password, accountCreationToken: '', token: '' })
        getService('credit').actions.useFetchCredits()
      },
    },
  }
}
