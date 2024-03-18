import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ dispatch: mockDispatch, ...mockState }),
}))

const firstName = 'John'
const lastName = 'Doe'

describe('<SetName/>', () => {
  afterEach(() => {
    storage.clear('activation_profile')
  })

  it('should render correctly', () => {
    render(<SetName />)

    expect(screen).toMatchSnapshot()
  })

  it('should enable the submit button when first name and last name is not empty', async () => {
    render(<SetName />)

    const continueButton = screen.getByTestId('Continuer vers l’étape suivante')

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
    render(<SetName />)

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    await act(async () => fireEvent.changeText(firstNameInput, firstName))

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    await act(async () => fireEvent.changeText(lastNameInput, lastName))

    const continueButton = await screen.findByText('Continuer')
    await act(async () => fireEvent.press(continueButton))

    expect(await storage.readObject('activation_profile')).toMatchObject({
      name: { firstName, lastName },
    })
  })

  it('should navigate to SetCity when submit name', async () => {
    render(<SetName />)

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    await act(async () => fireEvent.changeText(firstNameInput, firstName))

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    await act(async () => fireEvent.changeText(lastNameInput, lastName))

    const continueButton = await screen.findByText('Continuer')
    await act(async () => fireEvent.press(continueButton))

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_NAME',
      payload: { firstName, lastName },
    })

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SetCity')
    })
  })

  it('should log screen view when the screen is mounted', () => {
    render(<SetName />)

    expect(analytics.logScreenViewSetName).toHaveBeenCalledTimes(1)
  })

  it('should log analytics on press Continuer', async () => {
    render(<SetName />)

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
