import { IAuthContext } from '../AuthContext'

export const setIsLoggedIn = jest.fn()

export const useAuthContext = jest.fn(
  (): IAuthContext => ({
    setIsLoggedIn,
    isLoggedIn: false,
  })
)

export const signOut = jest.fn()

export const useLogoutRoutine = jest.fn(() => signOut)

export const loginRoutine = jest.fn()

export const useLoginRoutine = jest.fn(() => loginRoutine)

