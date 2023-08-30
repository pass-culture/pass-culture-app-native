import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { AgeInformationTutorial } from 'features/firstTutorial/pages/AgeInformationTutorial/AgeInformationTutorial'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { beneficiaryUser } from 'fixtures/user'
import { fireEvent, render, screen } from 'tests/utils'

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

  it('should display activation age', () => {
    mockUseAuthContext.mockReturnValueOnce(defaultAuthContext)
    render(<AgeInformationTutorial selectedAge={18} />)

    expect(screen.getByText('Crédit activé à 18 ans')).toBeTruthy()
  })

  it("should open questionnaire when pressing on 'Donner mon avis'", () => {
    mockUseAuthContext.mockReturnValueOnce(defaultAuthContext)
    render(<AgeInformationTutorial selectedAge={18} />)

    const link = screen.getByText('Donner mon avis')
    fireEvent.press(link)

    expect(openUrl).toHaveBeenCalledWith(
      'https://passculture.qualtrics.com/jfe/form/SV_8rkHZvOvmtdq4V8',
      undefined,
      true
    )
  })
})
