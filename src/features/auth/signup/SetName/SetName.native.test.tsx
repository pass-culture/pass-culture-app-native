import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { SetName } from 'features/auth/signup/SetName'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { fireEvent, render, waitFor } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

jest.mock('features/auth/settings')

describe('<SetName/>', () => {
  it('should enable the submit button when first name and last name is not empty', async () => {
    const { getByPlaceholderText, getByTestId } = renderSetName()

    const continueButton = getByTestId('Continuer')

    const background = continueButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.GREY_LIGHT)

    const firstNameInput = getByPlaceholderText('Ton prénom')
    const lastNameInput = getByPlaceholderText('Ton nom')
    fireEvent.changeText(firstNameInput, 'John')
    fireEvent.changeText(lastNameInput, 'Doe')

    await waitFor(async () => {
      const background = continueButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  it('should navigate to SetPassword page when submit name', async () => {
    const { getByPlaceholderText, findByText } = renderSetName()

    const firstNameInput = getByPlaceholderText('Ton prénom')
    const lastNameInput = getByPlaceholderText('Ton nom')
    fireEvent.changeText(firstNameInput, 'John')
    fireEvent.changeText(lastNameInput, 'Doe')

    const continueButton = await findByText('Continuer')
    fireEvent.press(continueButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('SetPassword', {
        email: 'john.doe@example.com',
        isNewsletterChecked: true,
        firstName: 'John',
        lastName: 'Doe',
      })
    })
  })

  it('should navigate to previous page when clicking on leftIcon', () => {
    const { getByTestId } = renderSetName()
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should open quit signup modal', () => {
    const { getByTestId, queryByText } = renderSetName()

    const rightIcon = getByTestId('rightIcon')
    fireEvent.press(rightIcon)

    const title = queryByText("Veux-tu abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })
})

function renderSetName() {
  const navigationProps = {
    route: { params: { email: 'john.doe@example.com', isNewsletterChecked: true } },
  } as StackScreenProps<RootStackParamList, 'SetName'>
  return render(<SetName {...navigationProps} />)
}
