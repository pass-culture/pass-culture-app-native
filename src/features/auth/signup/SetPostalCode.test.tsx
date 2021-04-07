import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { goBack } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { ColorsEnum } from 'ui/theme'

import { SetPostalCode } from './SetPostalCode'

describe('SetPostalCode Page', () => {
  it('should enable the submit button when postalCode contains 5 numbers', async () => {
    const { getByPlaceholderText, getByTestId } = renderChoosePostalCode()

    const continueButton = getByTestId('button-container')

    const background = continueButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.GREY_LIGHT)

    const postalCodeInput = getByPlaceholderText('Ex: 35000')

    fireEvent.changeText(postalCodeInput, '35000')

    await waitFor(async () => {
      const background = continueButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  it('should navigate to AcceptCgu page when validating postalCode', async () => {
    const { getByPlaceholderText, findByText } = renderChoosePostalCode()

    const passwordInput = getByPlaceholderText('Ex: 35000')
    fireEvent.changeText(passwordInput, '35000')

    const continueButton = await findByText('Continuer')
    fireEvent.press(continueButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('AcceptCgu', {
        email: 'john.doe@example.com',
        isNewsletterChecked: true,
        password: 'password',
        birthday: '12-2-1995',
        postalCode: '35000',
      })
    })
  })

  it('should navigate to previous page when clicking on leftIcon', () => {
    const { getByTestId } = renderChoosePostalCode()
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
  })

  it('should open quit signup modal', () => {
    const { getByTestId, queryByText } = renderChoosePostalCode()

    const rightIcon = getByTestId('rightIcon')
    fireEvent.press(rightIcon)

    const title = queryByText("Veux-tu abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })

  it('should display 5 step dots with the fourth one as current step', () => {
    const { getAllByTestId } = renderChoosePostalCode()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(5)
    expect(dots[3].props.fill).toEqual(ColorsEnum.PRIMARY)
  })
})

function renderChoosePostalCode() {
  const navigationProps = {
    route: {
      params: {
        email: 'john.doe@example.com',
        isNewsletterChecked: true,
        password: 'password',
        birthday: '12-2-1995',
      },
    },
  } as StackScreenProps<RootStackParamList, 'SetPostalCode'>
  return render(<SetPostalCode {...navigationProps} />)
}
