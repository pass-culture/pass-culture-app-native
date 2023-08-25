import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { AgeInformationTutorial } from 'features/firstTutorial/pages/AgeInformationTutorial/AgeInformationTutorial'
import { beneficiaryUser } from 'fixtures/user'
import { render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const defaultAuthContext = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  user: beneficiaryUser,
  refetchUser: jest.fn(),
  isUserLoading: false,
}

describe('<AgeInformationTutorial />', () => {
  it('should render correctly when logged in', () => {
    mockUseAuthContext.mockReturnValueOnce(defaultAuthContext)
    render(<AgeInformationTutorial selectedAge={15} />)

    expect(screen).toMatchSnapshot()
  })

  it('should display not logged in version when user is not loggedIn', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...defaultAuthContext,
      isLoggedIn: false,
      user: undefined,
    })
    render(<AgeInformationTutorial selectedAge={15} />)

    expect(screen).toMatchSnapshot()
  })
})
