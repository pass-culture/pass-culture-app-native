import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { UpdateEmailTokenExpiration, UserProfileResponse } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import * as OpenUrlAPI from 'features/navigation/helpers/openUrl'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/fixtures'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { PersonalData } from './PersonalData'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/jwt/jwt')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockedUseAuthContext = jest.spyOn(Auth, 'useAuthContext')
const openUrl = jest.spyOn(OpenUrlAPI, 'openUrl')
const user = userEvent.setup()

jest.useFakeTimers()

const mockedUser: UserProfileResponse = {
  ...beneficiaryUser,
  firstName: 'Rosa',
  lastName: 'Bonheur',
  email: 'rosa.bonheur@gmail.com',
  phoneNumber: '+33685974563',
}

const initialAuthContext = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  user: mockedUser,
  refetchUser: jest.fn(),
  isUserLoading: false,
}

mockedUseAuthContext.mockReturnValue(initialAuthContext)

describe('PersonalData', () => {
  beforeEach(() => {
    mockServer.getApi<UpdateEmailTokenExpiration>('/v1/profile/token_expiration', {
      expiration: null,
    })
  })

  it('should render personal data success', async () => {
    render(reactQueryProviderHOC(<PersonalData />))
    await screen.findByText('Informations personnelles')

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to ChangeEmail when clicking on modify email button', async () => {
    mockedUseAuthContext.mockReturnValueOnce({
      ...initialAuthContext,
      user: { ...mockedUser, isBeneficiary: false },
    })

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByTestId('Modifier e-mail'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'ChangeEmail',
    })
  })

  it('should redirect to ChangePassword when clicking on modify password button', async () => {
    mockedUseAuthContext.mockReturnValueOnce({
      ...initialAuthContext,
      user: { ...mockedUser, isBeneficiary: false },
    })

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByTestId('Modifier mot de passe'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'ChangePassword',
    })
  })

  it('should redirect to ChangeStatus when clicking on modify status button', async () => {
    mockedUseAuthContext.mockReturnValueOnce({
      ...initialAuthContext,
      user: { ...mockedUser, isBeneficiary: false },
    })

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByTestId('Modifier le statut'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'ChangeStatus',
    })
  })

  it('should redirect to ChangeCity when clicking on modify city button for beneficiaries', async () => {
    mockedUseAuthContext.mockReturnValueOnce(initialAuthContext)

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByTestId('Modifier la ville de résidence'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'ChangeCity',
    })
  })

  it('should log analytics and redirect to ConfirmDeleteProfile page when the account-deletion row is clicked', async () => {
    mockedUseAuthContext.mockReturnValueOnce({
      ...initialAuthContext,
      user: { ...mockedUser, isBeneficiary: false },
    })

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByText('Supprimer mon compte'))

    expect(analytics.logAccountDeletion).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'DeleteProfileReason',
    })
  })

  it('should open FAQ link when clicking on "Comment gérer tes données personnelles ?" button', async () => {
    mockedUseAuthContext.mockReturnValueOnce({
      ...initialAuthContext,
      user: { ...mockedUser, isBeneficiary: false },
    })

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByText('Comment gérer tes données personnelles ?'))

    expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_PERSONAL_DATA, undefined, true)
  })

  it('should log modify email when pressing "Modifier"', async () => {
    mockedUseAuthContext.mockReturnValueOnce(initialAuthContext)

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByTestId('Modifier e-mail'))

    expect(analytics.logModifyMail).toHaveBeenCalledTimes(1)
  })

  //TODO(PC-36587): unskip this test
  it.skip('should not show password field when user has no password', async () => {
    mockedUseAuthContext
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          hasPassword: false,
        },
      })
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          hasPassword: false,
        },
      })
    render(reactQueryProviderHOC(<PersonalData />))
    await screen.findByText('Adresse e-mail')

    expect(screen.queryByText('Mot de passe')).not.toBeOnTheScreen()
  })
})
