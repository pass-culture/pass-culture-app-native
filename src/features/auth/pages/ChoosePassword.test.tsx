import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { useNavigationMock } from '__mocks__/@react-navigation/native'
import { ChoosePassword } from 'features/auth/pages/ChoosePassword'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { navigationTestProps } from 'tests/navigation'
import { ColorsEnum } from 'ui/theme'

describe('ChoosePassword Page', () => {
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
      expect(navigationTestProps.navigation.navigate).toBeCalledTimes(1)
      expect(navigationTestProps.navigation.navigate).toHaveBeenCalledWith('SetBirthday')
    })
  })

  it('should navigate to previous page when clicking on leftIcon', () => {
    const { goBack } = useNavigationMock()
    goBack.mockReset()

    const { getByTestId } = renderChoosePassword()
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
    goBack.mockRestore()
  })

  // TODO: PC-5430 gestion du storage de l'email & password
  // TODO: PC-4936 right icon click = abandon registration
})

function renderChoosePassword() {
  return render(
    <ChoosePassword
      {...(navigationTestProps as StackScreenProps<RootStackParamList, 'ChoosePassword'>)}
    />
  )
}
