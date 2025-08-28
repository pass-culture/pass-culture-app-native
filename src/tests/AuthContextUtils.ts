import { useAuthContext } from 'features/auth/context/AuthContext'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

interface MockOptions {
  persist?: boolean
  refetchUser?: jest.Mock
}

export const mockAuthContextWithUser = (
  user: UserProfileResponseWithoutSurvey,
  { persist = false, refetchUser = jest.fn() }: MockOptions = {}
) => {
  const contextFixture = {
    isLoggedIn: true,
    user,
    setIsLoggedIn: jest.fn(),
    refetchUser,
    isUserLoading: false,
  }
  if (persist) {
    mockUseAuthContext.mockReturnValue(contextFixture)
  } else {
    mockUseAuthContext.mockReturnValueOnce(contextFixture)
  }
}

export const mockAuthContextWithoutUser = ({
  persist = false,
  refetchUser = jest.fn(),
}: MockOptions = {}) => {
  const contextFixture = {
    isLoggedIn: false,
    user: undefined,
    setIsLoggedIn: jest.fn(),
    refetchUser,
    isUserLoading: false,
  }

  if (persist) {
    mockUseAuthContext.mockReturnValue(contextFixture)
  } else {
    mockUseAuthContext.mockReturnValueOnce(contextFixture)
  }
}
