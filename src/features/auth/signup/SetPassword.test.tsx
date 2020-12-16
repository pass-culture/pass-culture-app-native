import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { goBack } from '__mocks__/@react-navigation/native'
import { SetPassword } from 'features/auth/signup/SetPassword'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { ColorsEnum } from 'ui/theme'

describe('SetPassword Page', () => {
  it('should enable the submit button when password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = renderChoosePassword()

    const continueButton = getByTestId('button-container')

    const background = continueButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.PRIMARY_DISABLED)

    const passwordInput = getByPlaceholderText('Ton mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    await waitFor(async () => {
      const background = continueButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  it('should navigate to SetBirthday page when submit password', async () => {
    const { getByPlaceholderText, findByText } = renderChoosePassword()

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    const continueButton = await findByText('Continuer')
    fireEvent.press(continueButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('SetBirthday', {
        email: 'john.doe@example.com',
        isNewsletterChecked: true,
        password: 'user@AZERTY123',
      })
    })
  })

  it('should navigate to previous page when clicking on leftIcon', () => {
    const { getByTestId } = renderChoosePassword()
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
  })

  it('should open quit signup modal', () => {
    const { getByTestId, queryByText } = renderChoosePassword()

    const rightIcon = getByTestId('rightIcon')
    fireEvent.press(rightIcon)

    const title = queryByText("Es-tu sûr de vouloir abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })

  it('should display 4 step dots with the second one as current step', () => {
    const { getAllByTestId } = renderChoosePassword()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[1].props.fill).toEqual(ColorsEnum.PRIMARY)
  })
})

function renderChoosePassword() {
  const navigationProps = {
    route: { params: { email: 'john.doe@example.com', isNewsletterChecked: true } },
  } as StackScreenProps<RootStackParamList, 'SetPassword'>
  return render(<SetPassword {...navigationProps} />)
}
