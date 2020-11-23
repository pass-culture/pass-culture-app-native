import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { Signup } from 'features/auth/pages/Signup'
import { HomeStackParamList } from 'features/home/navigation/HomeNavigator'
import { navigationTestProps } from 'tests/navigation'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('<Signup />', () => {
  it('should enable validate button when email input is filled', async () => {
    const { getByPlaceholderText, toJSON } = renderPage()
    const disabledButtonSnapshot = toJSON()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    await waitForExpect(() => {
      const enabledButtonSnapshot = toJSON()
      expect(disabledButtonSnapshot).toMatchDiffSnapshot(enabledButtonSnapshot)
    })
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
})

function renderPage() {
  return render(
    <Signup {...(navigationTestProps as StackScreenProps<HomeStackParamList, 'Signup'>)} />
  )
}
