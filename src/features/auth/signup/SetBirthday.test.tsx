import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render } from '@testing-library/react-native'
import mockdate from 'mockdate'
import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ColorsEnum } from 'ui/theme'

import { SetBirthday } from './SetBirthday'

describe('SetBirthday Page', () => {
  beforeEach(() => {
    // @ts-ignore: logClickWhyAnniversary is the mock function but is seen as the real function
    analytics.logClickWhyAnniversary.mockClear()
    mockdate.set(new Date('2020-12-01T00:00:00Z'))
    jest.useFakeTimers()
  })

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

  it('should display the error message "date incorrecte" when the date is too old', () => {
    const { queryByText, getByText, getByPlaceholderText } = renderSetBirthday()

    const day = getByPlaceholderText('JJ')
    const month = getByPlaceholderText('MM')
    const year = getByPlaceholderText('AAAA')

    fireEvent.changeText(day, '31')
    fireEvent.changeText(month, '12')
    fireEvent.changeText(year, '1899')

    const continueButton = getByText('Continuer')
    fireEvent.press(continueButton)

    const message = queryByText('La date choisie est incorrecte')
    expect(message).toBeTruthy()
  })

  it('should display the error message "date incorrecte" when the date is incorrect', () => {
    const { queryByText, getByText, getByPlaceholderText } = renderSetBirthday()

    const day = getByPlaceholderText('JJ')
    const month = getByPlaceholderText('MM')
    const year = getByPlaceholderText('AAAA')

    fireEvent.changeText(day, '?!')
    fireEvent.changeText(month, '02')
    fireEvent.changeText(year, '2002')

    const continueButton = getByText('Continuer')
    fireEvent.press(continueButton)

    const message = queryByText('La date choisie est incorrecte')
    expect(message).toBeTruthy()
  })

  it('should display the error message "tu dois avoir 16 ans" when the date is too young', () => {
    const { queryByText, getByText, getByPlaceholderText } = renderSetBirthday()

    const day = getByPlaceholderText('JJ')
    const month = getByPlaceholderText('MM')
    const year = getByPlaceholderText('AAAA')

    fireEvent.changeText(day, '01')
    fireEvent.changeText(month, '01')
    fireEvent.changeText(year, '2005')

    const continueButton = getByText('Continuer')
    fireEvent.press(continueButton)

    const message = queryByText("Tu dois avoir 16 ans pour t'inscrire")
    expect(message).toBeTruthy()
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

    const link = getByTestId('external-link-google-data-privacy')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('https://policies.google.com/privacy')
    })
  })

  it('should redirect to the "reCAPTCHA terms" page', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)

    const { getByTestId } = renderSetBirthday()

    const link = getByTestId('external-link-google-cgu')
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
    it('should log WhyAnniversary when clicking "Pourquoi" link', () => {
      const { getByTestId } = renderSetBirthday()

      const whyBirthdayLink = getByTestId('button-title-why-link')
      fireEvent.press(whyBirthdayLink)

      expect(analytics.logClickWhyAnniversary).toHaveBeenCalledTimes(1)
    })

    it('should log CancelSignup when clicking on "Abandonner l\'inscription"', () => {
      const { getByTestId, getByText } = renderSetBirthday()

      const rightIcon = getByTestId('rightIcon')
      fireEvent.press(rightIcon)

      const abandonButton = getByText("Abandonner l'inscription")
      fireEvent.press(abandonButton)

      expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
      expect(analytics.logCancelSignup).toHaveBeenCalledWith('Birthday')
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
