import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { SetPassword } from 'features/auth/signup/SetPassword'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

jest.mock('features/auth/settings')

describe('SetPassword Page', () => {
  it('should enable the submit button when password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = renderChoosePassword()

    const continueButton = getByTestId('Continuer')

    const background = continueButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.GREY_LIGHT)

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

    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should open quit signup modal', () => {
    const { getByTestId, queryByText } = renderChoosePassword()

    const rightIcon = getByTestId('rightIcon')
    fireEvent.press(rightIcon)

    const title = queryByText("Veux-tu abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })

  it('should display 5 step dots with the second one as current step', () => {
    const { getAllByTestId } = renderChoosePassword()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[1].props.fill).toEqual(ColorsEnum.PRIMARY)
  })

  describe('<SetPassword /> - Analytics', () => {
    it('should log CancelSignup when clicking on "Abandonner l\'inscription"', () => {
      const { getByTestId, getByText } = renderChoosePassword()

      const rightIcon = getByTestId('rightIcon')
      fireEvent.press(rightIcon)

      const abandonButton = getByText("Abandonner l'inscription")
      fireEvent.press(abandonButton)

      expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
      expect(analytics.logCancelSignup).toHaveBeenCalledWith('Password')
    })
  })
})

function renderChoosePassword() {
  const navigationProps = {
    route: { params: { email: 'john.doe@example.com', isNewsletterChecked: true } },
  } as StackScreenProps<RootStackParamList, 'SetPassword'>
  return render(<SetPassword {...navigationProps} />)
}
