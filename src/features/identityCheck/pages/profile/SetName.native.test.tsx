import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { storage } from 'libs/storage'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

const firstName = 'John'
const lastName = 'Doe'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<SetName/>', () => {
  it('should render correctly', () => {
    renderSetName({ type: ProfileTypes.IDENTITY_CHECK })

    expect(screen).toMatchSnapshot()
  })

  it('should display correct infos in identity check', async () => {
    renderSetName({ type: ProfileTypes.IDENTITY_CHECK })

    expect(await screen.findByText('Profil')).toBeTruthy()
    expect(await screen.findByText('Comment t’appelles-tu\u00a0?')).toBeTruthy()
    expect(
      await screen.findByText(
        'Saisis ton nom et ton prénom tels qu’ils sont affichés sur ta pièce d’identité. Nous les vérifions et ils ne pourront plus être modifiés par la suite.'
      )
    ).toBeTruthy()
  })

  it('should display correct infos in booking free offer 15/16 years', async () => {
    renderSetName({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
    expect(await screen.findByText('Renseigne ton prénom et ton nom')).toBeTruthy()
    expect(
      await screen.findByText(
        'Pour réserver une offre gratuite, on a besoin de ton prénom, nom, ton lieu de résidence et adresse, ainsi que ton statut. Ces informations seront vérifiées par le partenaire culturel.'
      )
    ).toBeTruthy()
  })

  it('should enable the submit button when first name and last name is not empty', async () => {
    renderSetName({ type: ProfileTypes.IDENTITY_CHECK })

    const continueButton = screen.getByTestId('Continuer vers la ville de résidence')

    expect(continueButton).toBeDisabled()

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    fireEvent.changeText(firstNameInput, firstName)

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    fireEvent.changeText(lastNameInput, lastName)

    await waitFor(async () => {
      expect(continueButton).toBeEnabled()
    })
  })

  it('should store name in storage when submit name', async () => {
    renderSetName({ type: ProfileTypes.IDENTITY_CHECK })

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    await act(async () => fireEvent.changeText(firstNameInput, firstName))

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    await act(async () => fireEvent.changeText(lastNameInput, lastName))

    await user.press(screen.getByText('Continuer'))

    expect(await storage.readObject('profile-name')).toMatchObject({
      state: {
        name: { firstName, lastName },
      },
    })
  })

  it('should navigate to SetCity with identityCheck params when submit name', async () => {
    renderSetName({ type: ProfileTypes.IDENTITY_CHECK })

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    await act(async () => fireEvent.changeText(firstNameInput, firstName))

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    await act(async () => fireEvent.changeText(lastNameInput, lastName))

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SetCity', { type: ProfileTypes.IDENTITY_CHECK })
  })

  it('should navigate to SetCity with booking params when submit name', async () => {
    renderSetName({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    await act(async () => fireEvent.changeText(firstNameInput, firstName))

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    await act(async () => fireEvent.changeText(lastNameInput, lastName))

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SetCity', {
      type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
    })
  })
})

const renderSetName = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    SubscriptionRootStackParamList,
    'SetName'
  >
  return render(<SetName {...navProps} />)
}
