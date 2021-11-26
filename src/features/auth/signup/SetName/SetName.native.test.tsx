import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { SetName } from 'features/auth/signup/SetName'
import { fireEvent, render, waitFor } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

jest.mock('features/auth/settings')
const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: () => ({ dispatch: mockDispatch }),
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

    const continueButton = getByTestId('Continuer')

    const background = continueButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.GREY_LIGHT)

    const firstNameInput = getByPlaceholderText('Ton prénom')
    const lastNameInput = getByPlaceholderText('Ton nom')
    fireEvent.changeText(firstNameInput, firstName)
    fireEvent.changeText(lastNameInput, lastName)

    await waitFor(async () => {
      const background = continueButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  it('should navigate to SetPostalCode page when submit name', async () => {
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
        payload: {firstName, lastName },
      })
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('IdentityCheckPostalCode')
    })
  })
})
