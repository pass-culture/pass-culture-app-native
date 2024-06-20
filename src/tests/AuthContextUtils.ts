import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'

export const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

interface MockOptions {
  persist?: boolean
}

export const mockAuthContextWithUser = (user: UserProfileResponse, options?: MockOptions) => {
  const contextFixture = {
    isLoggedIn: true,
    user,
    setIsLoggedIn: jest.fn(),
    refetchUser: jest.fn(),
    isUserLoading: false,
  }
  if (options?.persist) {
    mockUseAuthContext.mockReturnValue(contextFixture)
  } else {
    mockUseAuthContext.mockReturnValueOnce(contextFixture)
  }
}

export const mockAuthContextWithoutUser = (options?: MockOptions) => {
  const contextFixture = {
    isLoggedIn: false,
    user: undefined,
    setIsLoggedIn: jest.fn(),
    refetchUser: jest.fn(),
    isUserLoading: false,
  }
  if (options?.persist) {
    mockUseAuthContext.mockReturnValue(contextFixture)
  } else {
    mockUseAuthContext.mockReturnValueOnce(contextFixture)
  }
}
