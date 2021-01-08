import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render, RenderAPI } from '@testing-library/react-native'
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
    mockdate.set(new Date('2020-12-01T00:00:00Z'))
    jest.useFakeTimers()
    jest.clearAllMocks()
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
    const renderAPI = renderSetBirthday()

    changeDate(renderAPI, '1', '1', '1')

    const button = renderAPI.getByTestId('button-container-validate-birthday')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY_DISABLED)
  })

  it('should display the error message "date incorrecte" when the date is too old', () => {
    const renderAPI = renderSetBirthday()

    changeDate(renderAPI, '31', '12', '1889')

    const message = renderAPI.queryByText('La date choisie est incorrecte')
    expect(message).toBeTruthy()
  })

  it('should display the error message "date incorrecte" when the date is incorrect', () => {
    const renderAPI = renderSetBirthday()

    changeDate(renderAPI, '?!', '01', '2002')

    const message = renderAPI.queryByText('La date choisie est incorrecte')
    expect(message).toBeTruthy()
  })

  it('should display the error message "tu dois avoir 16 ans" when the date is too young', () => {
    const renderAPI = renderSetBirthday()

    changeDate(renderAPI, '01', '01', '2005')

    const message = renderAPI.queryByText("Tu dois avoir 16 ans pour t'inscrire")
    expect(message).toBeTruthy()
  })

  it('should enable the button "Continuer" when the date is correct', () => {
    const renderAPI = renderSetBirthday()

    changeDate(renderAPI, '16', '01', '1995')

    const continueButton = renderAPI.getByText('Continuer')
    fireEvent.press(continueButton)

    const buttonContainer = renderAPI.getByTestId('button-container-validate-birthday')
    expect(buttonContainer.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
    expect(renderAPI.queryByText('La date choisie est incorrecte')).toBeFalsy()
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

    it('should not log any birthday analytics if the user is 16 years old or more', () => {
      const renderAPI = renderSetBirthday()

      changeDate(renderAPI, '01', '12', '2004')
      expect(analytics.logSignUpBetween14And15Included).not.toBeCalled()
      expect(analytics.logSignUpLessThanOrEqualTo13).not.toBeCalled()

      changeDate(renderAPI, '01', '12', '2000')
      expect(analytics.logSignUpBetween14And15Included).not.toBeCalled()
      expect(analytics.logSignUpLessThanOrEqualTo13).not.toBeCalled()
    })

    it('should log between 14 and 15 birthday analytics if the user is 15 years old', () => {
      const renderAPI = renderSetBirthday()

      changeDate(renderAPI, '01', '12', '2005')

      expect(analytics.logSignUpBetween14And15Included).toBeCalledTimes(1)
      expect(analytics.logSignUpLessThanOrEqualTo13).not.toBeCalled()
    })

    it('should log between 14 and 15 birthday analytics if the user is 14 years old', () => {
      const renderAPI = renderSetBirthday()

      changeDate(renderAPI, '01', '12', '2006')

      expect(analytics.logSignUpBetween14And15Included).toBeCalledTimes(1)
      expect(analytics.logSignUpLessThanOrEqualTo13).not.toBeCalled()
    })

    it('should log <= 13 birthday analytics if the user is 13 years old', () => {
      const renderAPI = renderSetBirthday()

      changeDate(renderAPI, '01', '12', '2007')

      expect(analytics.logSignUpBetween14And15Included).not.toBeCalled()
      expect(analytics.logSignUpLessThanOrEqualTo13).toBeCalledTimes(1)
    })

    it('should log <= 13 birthday analytics if the user is less than 13 years old', () => {
      const renderAPI = renderSetBirthday()

      changeDate(renderAPI, '01', '12', '2010')

      expect(analytics.logSignUpBetween14And15Included).not.toBeCalled()
      expect(analytics.logSignUpLessThanOrEqualTo13).toBeCalledTimes(1)
    })

    it('it should not should log between 14 and 15 birthday analytics more than once', () => {
      const renderAPI = renderSetBirthday()

      changeDate(renderAPI, '01', '12', '2005')
      expect(analytics.logSignUpBetween14And15Included).toBeCalledTimes(1)

      changeDate(renderAPI, '01', '12', '2006')
      expect(analytics.logSignUpBetween14And15Included).toBeCalledTimes(1)
    })

    it('it should not should log <= 13 birthday analytics more than once', () => {
      const renderAPI = renderSetBirthday()

      changeDate(renderAPI, '01', '12', '2007')
      expect(analytics.logSignUpLessThanOrEqualTo13).toBeCalledTimes(1)

      changeDate(renderAPI, '01', '12', '2010')
      expect(analytics.logSignUpLessThanOrEqualTo13).toBeCalledTimes(1)
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

function changeDate(renderAPI: RenderAPI, dayStr: string, monthStr: string, yearStr: string) {
  const day = renderAPI.getByPlaceholderText('JJ')
  const month = renderAPI.getByPlaceholderText('MM')
  const year = renderAPI.getByPlaceholderText('AAAA')

  fireEvent.changeText(day, dayStr)
  fireEvent.changeText(month, monthStr)
  fireEvent.changeText(year, yearStr)
}
