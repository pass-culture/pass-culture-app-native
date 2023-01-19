import React from 'react'
import waitForExpect from 'wait-for-expect'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { amplitude } from 'libs/amplitude'
import { fireEvent, render, waitFor } from 'tests/utils'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ dispatch: mockDispatch, ...mockState }),
}))

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

const firstName = 'John'
const lastName = 'Doe'

describe('<SetName/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SetName />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should enable the submit button when first name and last name is not empty', async () => {
    const { getByPlaceholderText, getByTestId } = render(<SetName />)

    const continueButton = getByTestId('Continuer vers l’étape suivante')
    expect(continueButton).toBeDisabled()

    const firstNameInput = getByPlaceholderText('Ton prénom')
    const lastNameInput = getByPlaceholderText('Ton nom')
    fireEvent.changeText(firstNameInput, firstName)
    fireEvent.changeText(lastNameInput, lastName)

    await waitFor(async () => {
      expect(continueButton).toBeEnabled()
    })
  })

  it('should navigate to next screen when submit name', async () => {
    const { getByPlaceholderText, findByText } = render(<SetName />)

    const firstNameInput = getByPlaceholderText('Ton prénom')
    const lastNameInput = getByPlaceholderText('Ton nom')
    fireEvent.changeText(firstNameInput, firstName)
    fireEvent.changeText(lastNameInput, lastName)

    const continueButton = await findByText('Continuer')
    fireEvent.press(continueButton)

    await waitForExpect(() => {
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_NAME',
        payload: { firstName, lastName },
      })
      expect(mockNavigateToNextScreen).toBeCalledTimes(1)
    })
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<SetName />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_set_name')
    )
  })

  it('should send a amplitude event set_name_clicked on press Continuer', async () => {
    const { getByPlaceholderText, findByText } = render(<SetName />)

    const firstNameInput = getByPlaceholderText('Ton prénom')
    const lastNameInput = getByPlaceholderText('Ton nom')
    fireEvent.changeText(firstNameInput, firstName)
    fireEvent.changeText(lastNameInput, lastName)

    const continueButton = await findByText('Continuer')
    fireEvent.press(continueButton)

    await waitForExpect(() => {
      // first call will be the event screen_view_set_name on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'set_name_clicked')
    })
  })
})
