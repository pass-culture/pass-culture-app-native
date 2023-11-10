import { StackScreenProps } from '@react-navigation/stack'
import { format } from 'date-fns'
import mockdate from 'mockdate'
import React from 'react'

import { SubscriptionStatus, UserProfileResponse, YoungStatusType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { CURRENT_DATE, SIXTEEN_AGE_DATE } from 'features/auth/fixtures/fixtures'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { beneficiaryUser, nonBeneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/__mocks__/provider'
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
const sixteenUser = { ...beneficiaryUser, birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd') }

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const navProps = { route: { params: { age: 15 } } } as StackScreenProps<
  TutorialRootStackParamList,
  'ProfileTutorialAgeInformation'
>

const navPropsSixteenSelected = { route: { params: { age: 16 } } } as StackScreenProps<
  TutorialRootStackParamList,
  'ProfileTutorialAgeInformation'
>

const navPropsSeventeenSelected = { route: { params: { age: 17 } } } as StackScreenProps<
  TutorialRootStackParamList,
  'ProfileTutorialAgeInformation'
>
const navPropsEighteenSelected = { route: { params: { age: 18 } } } as StackScreenProps<
  TutorialRootStackParamList,
  'ProfileTutorialAgeInformation'
>

describe('<ProfileTutorialAgeInformation />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should render correctly when logged in at 15', () => {
    mockAuthContextForAllRenders(underageBeneficiaryUser)
    render(<ProfileTutorialAgeInformation {...navProps} />)

    expect(screen).toMatchSnapshot()
  })

  it('should display 16 timeline when logged in at 16', () => {
    render(<ProfileTutorialAgeInformation {...navPropsSixteenSelected} />)

    expect(screen.getByTestId('sixteen-timeline')).toBeOnTheScreen()
  })

  it('should display 17 timeline when logged in at 17', () => {
    render(<ProfileTutorialAgeInformation {...navPropsSeventeenSelected} />)

    expect(screen.getByTestId('seventeen-timeline')).toBeOnTheScreen()
  })

  it('should display 18 timeline when logged in at 18', () => {
    render(<ProfileTutorialAgeInformation {...navPropsEighteenSelected} />)

    expect(screen.getByTestId('eighteen-timeline')).toBeOnTheScreen()
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
    render(<ProfileTutorialAgeInformation {...navPropsSixteenSelected} />)

    expect(screen.getByText('Tu as reçu 20 € à 15 ans')).toBeOnTheScreen()
  })

  it('should display that the user couldn‘t have 15 credit if more than 15 years old', () => {
    mockUseAuthContext.mockReturnValueOnce({ ...defaultAuthContext, isLoggedIn: false })
    render(<ProfileTutorialAgeInformation {...navPropsSixteenSelected} />)

    expect(
      screen.getByText(' Le crédit précédent n’est plus disponible car tu as plus de 15 ans.')
    ).toBeOnTheScreen()
  })

  it('should display that the user couldn‘t have 17 credit if more than 17 years old', () => {
    mockUseAuthContext.mockReturnValueOnce({ ...defaultAuthContext, isLoggedIn: false })
    render(<ProfileTutorialAgeInformation {...navPropsEighteenSelected} />)

    expect(
      screen.getByText('Les crédits précédents ne sont plus disponibles car tu as plus de 17 ans.')
    ).toBeOnTheScreen()
  })

  it('should display that the user couldn‘t have 15 or 16 credit if more than 16 years old', () => {
    mockUseAuthContext.mockReturnValueOnce({ ...defaultAuthContext, isLoggedIn: false })
    render(<ProfileTutorialAgeInformation {...navPropsSeventeenSelected} />)

    expect(
      screen.getByText(
        'Les crédits précédents ne sont plus disponibles car tu as plus de 16\u00a0ans.'
      )
    ).toBeOnTheScreen()
  })

  it('should display not logged in version when user is not loggedIn', () => {
    mockAuthContextForAllRenders()
    render(<ProfileTutorialAgeInformation {...navProps} />)

    expect(screen).toMatchSnapshot()
  })

  it("should open questionnaire when pressing on 'Donner mon avis'", () => {
    mockUseAuthContext.mockReturnValueOnce(defaultAuthContext)
    render(<ProfileTutorialAgeInformation {...navProps} />)

    const link = screen.getByText('Donner mon avis')
    fireEvent.press(link)

    expect(openUrl).toHaveBeenCalledWith(env.TUTORIAL_FEEDBACK_LINK, undefined, true)
  })

  it('should display verify eligibility when user is eligible', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...defaultAuthContext,
      user: {
        ...nonBeneficiaryUser,
        status: {
          statusType: YoungStatusType.eligible,
          subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
        },
      },
    })
    render(<ProfileTutorialAgeInformation {...navProps} />)

    expect(screen.getByText('Activer mon crédit')).toBeOnTheScreen()
  })

  it("should log to analytics when pressing 'Se connecter'", () => {
    mockUseAuthContext.mockReturnValueOnce({ ...defaultAuthContext, isLoggedIn: false })
    render(<ProfileTutorialAgeInformation {...navProps} />)

    const link = screen.getByText('Se connecter')
    fireEvent.press(link)

    expect(analytics.logLogin).toHaveBeenCalledWith({ from: 'Tutorial' })
  })

  it("should log to analytics when pressing 'Créer un compte'", () => {
    mockUseAuthContext.mockReturnValueOnce({ ...defaultAuthContext, isLoggedIn: false })
    render(<ProfileTutorialAgeInformation {...navProps} />)

    const link = screen.getByText('Créer un compte')
    fireEvent.press(link)

    expect(analytics.logStepperDisplayed).toHaveBeenCalledWith('Tutorial', 'Email')
  })
})

const mockAuthContextForAllRenders = (user?: UserProfileResponse) => {
  const mockedContext = {
    ...defaultAuthContext,
    isLoggedIn: !!user,
    user,
  }
  mockUseAuthContext.mockReturnValueOnce(mockedContext) // First call in ProfileTutorialAgeInformation
  mockUseAuthContext.mockReturnValueOnce(mockedContext) // Second call in useDepositActivationAge
  mockUseAuthContext.mockReturnValueOnce(mockedContext) // Third call in UnderageBlockDescription
  mockUseAuthContext.mockReturnValueOnce(mockedContext) // Fourth call in EighteenBlockDescription
}
