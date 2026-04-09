import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ChangePhoneNumber } from 'features/profile/pages/ChangePhoneNumber/ChangePhoneNumber'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
mockAuthContextWithUser({ ...beneficiaryUser, phoneNumber: '+33618181818' }, { persist: true })

jest.mock('libs/jwt/jwt')

function renderChangePhoneNumber() {
  render(reactQueryProviderHOC(<ChangePhoneNumber />))
}

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockIdentityCheckDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('ChangePhoneNumber', () => {
  it('should render correctly', async () => {
    renderChangePhoneNumber()

    await screen.findByText('Modifier mon numéro de téléphone')

    expect(screen).toMatchSnapshot()
  })

  it('should display previous phone number', async () => {
    renderChangePhoneNumber()

    const phoneNumberInput = await screen.findByTestId('Entrée pour le numéro de téléphone')

    expect(phoneNumberInput.props.value).toBe('618181818')
    expect(
      await screen.findByTestId('+33 - Ouvrir la modale de choix de l’indicatif téléphonique')
    ).toBeOnTheScreen()
  })

  it('should be able to change country id', async () => {
    renderChangePhoneNumber()

    const countryPickerButton = screen.getByTestId(
      '+33 - Ouvrir la modale de choix de l’indicatif téléphonique'
    )
    await user.press(countryPickerButton)

    await user.press(await screen.findByText('+596'))

    expect(
      await screen.findByTestId('+596 - Ouvrir la modale de choix de l’indicatif téléphonique')
    ).toBeOnTheScreen()
  })

  it('should enable the submit button when phone number is filled and valid', async () => {
    renderChangePhoneNumber()

    const phoneNumberInput = screen.getByTestId('Entrée pour le numéro de téléphone')

    await act(async () => {
      fireEvent.changeText(phoneNumberInput, '639980123')
    })

    const continueButton = screen.getByTestId('Continuer')

    expect(continueButton).toBeEnabled()
  })

  it('should display success snackbar when the phone number is updated', async () => {
    mockServer.patchApi('/v1/profile', {
      responseOptions: { data: {} },
    })

    renderChangePhoneNumber()

    const phoneNumberInput = screen.getByTestId('Entrée pour le numéro de téléphone')
    await act(async () => {
      fireEvent.changeText(phoneNumberInput, '0639980123')
    })

    await user.press(screen.getByTestId('Continuer'))

    expect(screen.getByText('Ton numéro de téléphone a bien été modifié !')).toBeOnTheScreen()
  })

  it('should navigate to PersonalData when the phone number is updated', async () => {
    mockServer.patchApi('/v1/profile', {
      responseOptions: { data: {} },
    })

    renderChangePhoneNumber()

    const phoneNumberInput = screen.getByTestId('Entrée pour le numéro de téléphone')
    await act(async () => {
      fireEvent.changeText(phoneNumberInput, '0639980123')
    })
    await user.press(screen.getByTestId('Continuer'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', { screen: 'PersonalData' })
  })

  it('should call analytics when the phone number is updated', async () => {
    mockServer.patchApi('/v1/profile', {
      responseOptions: { data: {} },
    })

    renderChangePhoneNumber()

    const phoneNumberInput = screen.getByTestId('Entrée pour le numéro de téléphone')
    await act(async () => {
      fireEvent.changeText(phoneNumberInput, '0639980123')
    })
    await user.press(screen.getByTestId('Continuer'))

    expect(analytics.logHasChangedPhoneNumber).toHaveBeenCalledTimes(1)
  })
})
