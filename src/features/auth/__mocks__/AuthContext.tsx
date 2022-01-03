import { useAuthContext as actualUseAuthContext } from '../AuthContext'

export const setIsLoggedIn = jest.fn()

export const useAuthContext = jest.fn().mockReturnValue({
  setIsLoggedIn,
  isLoggedIn: false,
}) as jest.MockedFunction<typeof actualUseAuthContext>

export const signOut = jest.fn()

export const useLogoutRoutine = jest.fn(() => signOut)

export const loginRoutine = jest.fn()

export const useLoginRoutine = jest.fn(() => loginRoutine)
