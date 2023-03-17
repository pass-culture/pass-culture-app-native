import React from 'react'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { amplitude } from 'libs/amplitude'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ dispatch: mockDispatch, ...mockState }),
}))

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/pages/helpers/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

const firstName = 'John'
const lastName = 'Doe'

describe('<SetName/>', () => {
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

  it('should navigate to next screen when submit name', async () => {
    render(<SetName />)

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    fireEvent.changeText(firstNameInput, firstName)

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    fireEvent.changeText(lastNameInput, lastName)

    const continueButton = await screen.findByText('Continuer')
    fireEvent.press(continueButton)

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_NAME',
      payload: { firstName, lastName },
    })
    expect(mockNavigateToNextScreen).toBeCalledTimes(1)
  })

  it('should send a amplitude event when the screen is mounted', () => {
    render(<SetName />)

    expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_set_name')
  })

  it('should send a amplitude event set_name_clicked on press Continuer', async () => {
    render(<SetName />)

    const firstNameInput = screen.getByPlaceholderText('Ton prénom')
    fireEvent.changeText(firstNameInput, firstName)

    const lastNameInput = screen.getByPlaceholderText('Ton nom')
    fireEvent.changeText(lastNameInput, lastName)

    const continueButton = await screen.findByText('Continuer')
    fireEvent.press(continueButton)

    // first call will be the event screen_view_set_name on mount
    expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'set_name_clicked')
  })
})
