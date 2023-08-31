import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { beneficiaryUser } from 'fixtures/user'
import { env } from 'libs/environment'
import { fireEvent, render, screen } from 'tests/utils'

import { ProfileTutorialAgeInformation } from './ProfileTutorialAgeInformation'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const defaultAuthContext = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  user: beneficiaryUser,
  refetchUser: jest.fn(),
  isUserLoading: false,
}

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<ProfileTutorialAgeInformation />', () => {
  it('should render correctly when logged in', () => {
    mockUseAuthContext.mockReturnValueOnce(defaultAuthContext)
    render(<ProfileTutorialAgeInformation selectedAge={15} />)

    expect(screen).toMatchSnapshot()
  })

  it('should display not logged in version when user is not loggedIn', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...defaultAuthContext,
      isLoggedIn: false,
      user: undefined,
    })
    render(<ProfileTutorialAgeInformation selectedAge={15} />)

    expect(screen).toMatchSnapshot()
  })

  it('should display activation age', () => {
    mockUseAuthContext.mockReturnValueOnce(defaultAuthContext)
    render(<ProfileTutorialAgeInformation selectedAge={18} />)

    expect(screen.getByText('Crédit activé à 18 ans')).toBeTruthy()
  })

  it("should open questionnaire when pressing on 'Donner mon avis'", () => {
    mockUseAuthContext.mockReturnValueOnce(defaultAuthContext)
    render(<ProfileTutorialAgeInformation selectedAge={18} />)

    const link = screen.getByText('Donner mon avis')
    fireEvent.press(link)

    expect(openUrl).toHaveBeenCalledWith(env.TUTORIAL_FEEDBACK_LINK, undefined, true)
  })
})
