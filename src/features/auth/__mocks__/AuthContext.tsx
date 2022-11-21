import { beneficiaryUser } from 'fixtures/user'

import { useAuthContext as actualUseAuthContext } from '../AuthContext'

export const setIsLoggedIn = jest.fn()

export const useAuthContext = jest.fn().mockReturnValue({
  setIsLoggedIn,
  isLoggedIn: false,
  user: beneficiaryUser,
  isUserLoading: false,
}) as jest.MockedFunction<typeof actualUseAuthContext>
