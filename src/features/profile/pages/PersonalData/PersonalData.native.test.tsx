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

const mockedUseAuthContext = jest.spyOn(Auth, 'useAuthContext')
const openUrl = jest.spyOn(OpenUrlAPI, 'openUrl')

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

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

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

  it('should render for beneficiary profile', async () => {
    render(reactQueryProviderHOC(<PersonalData />))

    await screen.findByText('Informations personnelles')

    expect(screen.getByText('Prénom et nom')).toBeOnTheScreen()
    expect(screen.getByText('Rosa Bonheur')).toBeOnTheScreen()
    expect(screen.getByText('Adresse e-mail')).toBeOnTheScreen()
    expect(screen.getByText('rosa.bonheur@gmail.com')).toBeOnTheScreen()
    expect(screen.getByText('Numéro de téléphone')).toBeOnTheScreen()
    expect(screen.getByText('+33685974563')).toBeOnTheScreen()
    expect(screen.getByText('Mot de passe')).toBeOnTheScreen()
    expect(screen.getByText('*'.repeat(12))).toBeOnTheScreen()
    expect(screen.getByText('Supprimer mon compte')).toBeOnTheScreen()
  })

  it('should render for beneficiary profile without phone number', async () => {
    mockedUseAuthContext
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          phoneNumber: null,
        },
      })
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          phoneNumber: null,
        },
      })

    render(reactQueryProviderHOC(<PersonalData />))

    await screen.findByText('Informations personnelles')

    expect(screen.getByText('Prénom et nom')).toBeOnTheScreen()
    expect(screen.getByText('Rosa Bonheur')).toBeOnTheScreen()
    expect(screen.getByText('Adresse e-mail')).toBeOnTheScreen()
    expect(screen.getByText('rosa.bonheur@gmail.com')).toBeOnTheScreen()
    expect(screen.queryByText('Numéro de téléphone')).not.toBeOnTheScreen()
    expect(screen.getByText('Mot de passe')).toBeOnTheScreen()
    expect(screen.getByText('*'.repeat(12))).toBeOnTheScreen()
    expect(screen.getByText('Supprimer mon compte')).toBeOnTheScreen()
  })

  it('should render for non beneficiary profile', async () => {
    mockedUseAuthContext
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          isBeneficiary: false,
        },
      })
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          isBeneficiary: false,
        },
      })
    render(reactQueryProviderHOC(<PersonalData />))

    await screen.findByText('Informations personnelles')

    expect(screen.queryByText('Prénom et nom')).not.toBeOnTheScreen()
    expect(screen.getByText('Adresse e-mail')).toBeOnTheScreen()
    expect(screen.getByText('Mot de passe')).toBeOnTheScreen()
    expect(screen.queryByText('Numéro de téléphone')).not.toBeOnTheScreen()
    expect(screen.getByText('Supprimer mon compte')).toBeOnTheScreen()
  })

  it('should redirect to ChangePassword when clicking on modify password button', async () => {
    mockedUseAuthContext
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          isBeneficiary: false,
        },
      })
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          isBeneficiary: false,
        },
      })

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByTestId('Modifier mot de passe'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'ChangePassword',
    })
  })

  it('should redirect to ChangeCity when clicking on modify city button for beneficiaries', async () => {
    mockedUseAuthContext
      .mockReturnValueOnce(initialAuthContext)
      .mockReturnValueOnce(initialAuthContext)

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
      user: {
        ...mockedUser,
        isBeneficiary: false,
      },
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
    mockedUseAuthContext
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          isBeneficiary: false,
        },
      })
      .mockReturnValueOnce({
        ...initialAuthContext,
        user: {
          ...mockedUser,
          isBeneficiary: false,
        },
      })

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByText('Comment gérer tes données personnelles ?'))

    expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_PERSONAL_DATA, undefined, true)
  })

  it('should log modify email when pressing "Modifier"', async () => {
    mockedUseAuthContext
      .mockReturnValueOnce(initialAuthContext)
      .mockReturnValueOnce(initialAuthContext)

    render(reactQueryProviderHOC(<PersonalData />))

    await user.press(screen.getByTestId('Modifier e-mail'))

    expect(screen.getByTestId('Modifier e-mail')).toBeOnTheScreen()

    expect(analytics.logModifyMail).toHaveBeenCalledTimes(1)
  })

  it('should not show password field when user has no password', async () => {
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
