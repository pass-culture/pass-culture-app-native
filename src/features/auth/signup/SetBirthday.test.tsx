import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { logClickWhyAnniversary } from 'libs/analytics'
import { ColorsEnum } from 'ui/theme'

import { SetBirthday } from './SetBirthday'

describe('SetBirthday Page', () => {
  it('should render properly', () => {
    const { toJSON } = renderSetBirthday()
    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to the previous page on back navigation', () => {
    const { getByTestId } = renderSetBirthday()
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
  })
  it('should keep disabled the button "Continuer" when the date is not complete', () => {
    const { getByPlaceholderText, getByTestId } = renderSetBirthday()

    const day = getByPlaceholderText('JJ')
    const month = getByPlaceholderText('MM')
    const year = getByPlaceholderText('AAAA')

    fireEvent.changeText(day, '1')
    fireEvent.changeText(month, '1')
    fireEvent.changeText(year, '1')

    const button = getByTestId('button-container-validate-birthday')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY_DISABLED)
  })
  it('should display the error message when the date is not correct', () => {
    const { getByText, getByPlaceholderText } = renderSetBirthday()

    const day = getByPlaceholderText('JJ')
    const month = getByPlaceholderText('MM')
    const year = getByPlaceholderText('AAAA')

    fireEvent.changeText(day, '29')
    fireEvent.changeText(month, '02')
    fireEvent.changeText(year, '2005')

    const continueButton = getByText('Continuer')
    fireEvent.press(continueButton)

    getByText('La date choisie est incorrecte')
  })
  it('should enable the button "Continuer" when the date is correct', () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId } = renderSetBirthday()

    const day = getByPlaceholderText('JJ')
    const month = getByPlaceholderText('MM')
    const year = getByPlaceholderText('AAAA')

    fireEvent.changeText(day, '16')
    fireEvent.changeText(month, '01')
    fireEvent.changeText(year, '1995')

    fireEvent(year, 'blur')

    const continueButton = getByText('Continuer')
    fireEvent.press(continueButton)

    const buttonContainer = getByTestId('button-container-validate-birthday')
    expect(buttonContainer.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
    expect(queryByText('La date choisie est incorrecte')).toBeFalsy()
    expect(navigate).toBeCalledWith('AcceptCgu', {
      birthday: '1995-01-16',
      email: 'john.doe@example.com',
      isNewsletterChecked: true,
      password: 'password',
    })
  })
  it('should display a information modal when clicking "Pourquoi" link', () => {
    const { getByTestId } = renderSetBirthday()

    const whyBirthdayLink = getByTestId('button-title-why-link')
    fireEvent.press(whyBirthdayLink)

    const birthdayModal = getByTestId('modal-birthday-information')
    expect(birthdayModal.props.visible).toBeTruthy()
  })

  it('should redirect to the "reCAPTCHA privacy" page', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)

    const { getByTestId } = renderSetBirthday()

    const link = await getByTestId('external-link-google-data-privacy')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('https://policies.google.com/privacy')
    })
  })

  it('should redirect to the "reCAPTCHA terms" page', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)

    const { getByTestId } = renderSetBirthday()

    const link = await getByTestId('external-link-google-cgu')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('https://policies.google.com/terms')
    })
  })

  it('should display 4 step dots with the third one as current step', () => {
    const { getAllByTestId } = renderSetBirthday()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[2].props.fill).toEqual(ColorsEnum.PRIMARY)
  })

  it('should call clear focuses', () => {
    const { getByTestId, getByText } = renderSetBirthday()
    const quitSignupModalButton = getByTestId('rightIconButton')

    fireEvent.press(quitSignupModalButton)

    expect(getByText("Continuer l'inscription")).toBeTruthy()
  })

  describe('SetBirthday - analytics', () => {
    it('should log Signup-whyAnniversary when clicking "Pourquoi" link', () => {
      jest.clearAllMocks()
      const { getByTestId } = renderSetBirthday()

      const whyBirthdayLink = getByTestId('button-title-why-link')
      fireEvent.press(whyBirthdayLink)

      expect(logClickWhyAnniversary).toHaveBeenCalledTimes(1)
    })
  })
})

function renderSetBirthday() {
  const navigationProps = {
    route: {
      params: { email: 'john.doe@example.com', isNewsletterChecked: true, password: 'password' },
    },
  } as StackScreenProps<RootStackParamList, 'SetBirthday'>
  return render(<SetBirthday {...navigationProps} />)
}
