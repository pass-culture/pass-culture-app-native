import { format } from 'date-fns'
import mockdate from 'mockdate'
import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import {
  CURRENT_DATE,
  FIFTEEN_YEARS_OLD_FIRST_DAY_DATE,
  SIXTEEN_AGE_DATE,
} from 'features/auth/fixtures/fixtures'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { beneficiaryUser } from 'fixtures/user'
import { env } from 'libs/environment'
import { fireEvent, render, screen } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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

const sixteenUser = { ...beneficiaryUser, birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd') }

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<ProfileTutorialAgeInformation />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })
  it('should render correctly when logged in at 15', () => {
    const fifteenUser = { ...beneficiaryUser, birthdate: FIFTEEN_YEARS_OLD_FIRST_DAY_DATE }
    mockUseAuthContext.mockReturnValueOnce({ ...defaultAuthContext, user: fifteenUser })
    render(<ProfileTutorialAgeInformation />)

    expect(screen).toMatchSnapshot()
  })

  it('should display 16 timeline when logged in at 16', () => {
    mockUseAuthContext.mockReturnValueOnce({ ...defaultAuthContext, user: sixteenUser })
    render(<ProfileTutorialAgeInformation />)

    expect(screen.getByText('à 16 ans')).toHaveStyle({ color: ColorsEnum.SECONDARY })
  })

  it('should display that the user has activated credit at 15 when logged in at 16', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...defaultAuthContext,
      user: { ...sixteenUser, depositActivationDate: '2019-12-01T00:00:00.000Z' },
    }) // for the component call
    mockUseAuthContext.mockReturnValueOnce({
      ...defaultAuthContext,
      user: { ...sixteenUser, depositActivationDate: '2019-12-01T00:00:00.000Z' },
    }) // for the useDepositActivationAge hook call
    render(<ProfileTutorialAgeInformation />)

    expect(screen.getByText('Tu as reçu 20 € à 15 ans')).toBeOnTheScreen()
  })

  it('should display that the user couldnt have 15 credit if more than 15 years old', () => {
    mockUseAuthContext.mockReturnValueOnce({ ...defaultAuthContext, isLoggedIn: false })
    render(<ProfileTutorialAgeInformation selectedAge={16} />)

    expect(
      screen.getByText(' Le crédit précédent n’est plus disponible car tu as plus de 15 ans.')
    ).toBeOnTheScreen()
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

  it("should open questionnaire when pressing on 'Donner mon avis'", () => {
    mockUseAuthContext.mockReturnValueOnce(defaultAuthContext)
    render(<ProfileTutorialAgeInformation selectedAge={18} />)

    const link = screen.getByText('Donner mon avis')
    fireEvent.press(link)

    expect(openUrl).toHaveBeenCalledWith(env.TUTORIAL_FEEDBACK_LINK, undefined, true)
  })
})
