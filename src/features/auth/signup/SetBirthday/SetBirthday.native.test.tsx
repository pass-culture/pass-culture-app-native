import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse } from 'api/gen'
import { mockDefaultSettings } from 'features/auth/__mocks__/settings'
import { useAppSettings } from 'features/auth/settings'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { fireEvent, render, RenderAPI } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { SetBirthday } from './SetBirthday'

jest.mock('features/auth/settings')
jest.mock('features/auth/api', () => {
  const originalModule = jest.requireActual('features/auth/api')

  return {
    ...originalModule,
    useDepositAmountsByAge: jest.fn().mockReturnValue({
      fifteenYearsOldDeposit: '20 €',
      sixteenYearsOldDeposit: '30 €',
      seventeenYearsOldDeposit: '30 €',
      eighteenYearsOldDeposit: '300 €',
    }),
  }
})
const mockedUseAppSettings = mocked(useAppSettings)

describe('SetBirthday Page', () => {
  beforeEach(() => {
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

    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should keep disabled the button "Continuer" when the date is not complete', () => {
    const renderAPI = renderSetBirthday()

    changeDate(renderAPI, '1', '1', '1')

    const button = renderAPI.getByTestId('Continuer')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
  })

  it('should show the correct deposit amount', async () => {
    const component = renderSetBirthday()
    fireEvent.press(component.getByTestId('Pourquoi ?'))
    expect(component.queryByText(/une aide financière de/)).toBeTruthy()
    expect(component.queryByText(new RegExp('300' + '\u00a0' + '€'))).toBeTruthy()
  })

  it('should show the correct deposit amount if generalisation is enabled', async () => {
    const mockSettings = {
      ...mockDefaultSettings,
      enableUnderageGeneralisation: true,
      enableNativeEacIndividual: true,
    }
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseAppSettings.mockImplementation(
      () =>
        ({
          data: mockSettings,
        } as UseQueryResult<SettingsResponse, unknown>)
    )
    const component = renderSetBirthday()
    fireEvent.press(component.getByTestId('Pourquoi ?'))
    expect(component.queryByText(/une aide financière progressive allant de/)).toBeTruthy()

    expect(component.queryByText(new RegExp('20' + '\u00a0' + '€'))).toBeTruthy()
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseAppSettings.mockImplementation(
      () =>
        ({ data: mockDefaultSettings, isLoading: false } as UseQueryResult<
          SettingsResponse,
          unknown
        >)
    )
  })

  it('should display the error message "date incorrecte" when the date is too old', async () => {
    const renderAPI = renderSetBirthday()

    changeDate(renderAPI, '31', '12', '1889')

    await waitForExpect(() => {
      const message = renderAPI.queryByText('La date choisie est incorrecte')
      expect(message).toBeTruthy()
    })
  })

  it('should display the error message "tu dois avoir 15 ans" when the date is too young', () => {
    const renderAPI = renderSetBirthday()

    changeDate(renderAPI, '01', '01', '2006')

    const message = renderAPI.queryByText(
      'Tu dois avoir' + '\u00a0' + 15 + '\u00a0' + "ans pour t'inscrire"
    )
    expect(message).toBeTruthy()
  })

  it('should navigate to CGU', () => {
    const renderAPI = renderSetBirthday()

    changeDate(renderAPI, '16', '01', '1995')

    const continueButton = renderAPI.getByText('Continuer')
    fireEvent.press(continueButton)

    expect(navigate).toBeCalledWith('AcceptCgu', {
      birthday: '1995-01-16',
      email: 'john.doe@example.com',
      isNewsletterChecked: true,
      password: 'password',
    })
  })

  it('should display a information modal when clicking "Pourquoi" link', () => {
    const { getByTestId, toJSON } = renderSetBirthday()

    const whyBirthdayLink = getByTestId('Pourquoi ?')
    fireEvent.press(whyBirthdayLink)

    const birthdayModal = getByTestId('modal-birthday-information')
    expect(birthdayModal.props.visible).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should display 4 step dots with the third one as current step', () => {
    const { getAllByTestId } = renderSetBirthday()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[2].props.fill).toEqual(ColorsEnum.PRIMARY)
  })

  it('should call clear focuses', () => {
    const { getByTestId, getByText } = renderSetBirthday()
    const quitSignupModalButton = getByTestId("Abandonner l'inscription")

    fireEvent.press(quitSignupModalButton)

    expect(getByText("Continuer l'inscription")).toBeTruthy()
  })

  describe('SetBirthday - analytics', () => {
    it('should log ConsultModalWhyAnniversary when clicking "Pourquoi" link', () => {
      const { getByTestId } = renderSetBirthday()

      const whyBirthdayLink = getByTestId('Pourquoi ?')
      fireEvent.press(whyBirthdayLink)

      expect(analytics.logConsultWhyAnniversary).toHaveBeenCalledTimes(1)
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

    it('should not log SignUpTooYoung if the user is 15 years old or more', () => {
      const renderAPI = renderSetBirthday()

      changeDate(renderAPI, '01', '12', '2005')
      expect(analytics.logSignUpTooYoung).not.toBeCalled()
    })

    it('should log SignUpTooYoung if the user is 14 years old or less', () => {
      const renderAPI = renderSetBirthday()

      changeDate(renderAPI, '01', '12', '2006')
      expect(analytics.logSignUpTooYoung).toBeCalledTimes(1)
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
  const dateInput = renderAPI.getByTestId(t`Entrée pour la date de naissance`)
  fireEvent.changeText(dateInput, [dayStr, monthStr, yearStr].join(''))
}
