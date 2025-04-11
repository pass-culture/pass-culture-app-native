import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { storage } from 'libs/storage'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

const firstName = 'John'
const lastName = 'Doe'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SetName/>', () => {
  it('should render correctly in identity check', () => {
    renderSetName({ type: ProfileTypes.IDENTITY_CHECK })

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly in booking', () => {
    renderSetName({ type: ProfileTypes.BOOKING })

    expect(screen).toMatchSnapshot()
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

    const continueButton = await screen.findByText('Continuer')
    await act(async () => fireEvent.press(continueButton))

    expect(await storage.readObject('profile-name')).toMatchObject({
      state: {
        name: { firstName, lastName },
      },
    })
  })

  it('should navigate to SetCity when submit name', async () => {
    renderSetName({ type: ProfileTypes.IDENTITY_CHECK })

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    await act(async () => fireEvent.changeText(firstNameInput, firstName))

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    await act(async () => fireEvent.changeText(lastNameInput, lastName))

    const continueButton = await screen.findByText('Continuer')
    await act(async () => fireEvent.press(continueButton))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SetCity')
    })
  })

  it('should log analytics on press Continuer', async () => {
    renderSetName({ type: ProfileTypes.IDENTITY_CHECK })

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    await act(async () => fireEvent.changeText(firstNameInput, firstName))

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    await act(async () => fireEvent.changeText(lastNameInput, lastName))

    const continueButton = await screen.findByText('Continuer')
    await act(async () => fireEvent.press(continueButton))

    await waitFor(() => {
      expect(analytics.logSetNameClicked).toHaveBeenCalledTimes(1)
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
