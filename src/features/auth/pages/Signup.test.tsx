import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { Signup } from 'features/auth/pages/Signup'
import { AllNavParamList } from 'features/navigation/RootNavigator'
import { navigationTestProps } from 'tests/navigation'
import { ColorsEnum } from 'ui/theme'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('<Signup />', () => {
  it('should display disabled validate button when email input is not filled', async () => {
    const { getByTestId } = renderPage()

    const button = getByTestId('button-container')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY_DISABLED)
  })

  it('should enable validate button when email input is filled', async () => {
    const { getByTestId, getByPlaceholderText } = renderPage()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const button = getByTestId('button-container')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
  })

  it('should redirect to SignUpSignInChoiceModal when clicking on ArrowPrevious icon', async () => {
    const { getByTestId } = renderPage()

    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    await waitForExpect(() => {
      expect(navigationTestProps.navigation.navigate).toBeCalledTimes(1)
      expect(navigationTestProps.navigation.navigate).toHaveBeenCalledWith('Home', {
        shouldDisplayLoginModal: true,
      })
    })
  })

  it('should navigate to ChoosePassword page when submit email', async () => {
    const { getByPlaceholderText, findByText } = renderPage()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const continueButton = await findByText('Continuer')
    fireEvent.press(continueButton)

    await waitForExpect(() => {
      expect(navigationTestProps.navigation.navigate).toBeCalledTimes(1)
      expect(navigationTestProps.navigation.navigate).toHaveBeenCalledWith('ChoosePassword')
    })
  })
})

function renderPage() {
  return render(
    <Signup
      {...((navigationTestProps as unknown) as StackScreenProps<AllNavParamList, 'Signup'>)}
    />
  )
}
