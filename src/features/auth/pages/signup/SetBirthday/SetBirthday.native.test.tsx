import mockdate from 'mockdate'
import React from 'react'

import {
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
  ELIGIBLE_AGE_DATE,
} from 'features/auth/fixtures/fixtures'
import { NonEligible } from 'features/tutorial/types'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { storage } from 'libs/storage'
import { fireEvent, render, screen } from 'tests/utils'

import { SetBirthday } from './SetBirthday'

const props = {
  goToNextStep: jest.fn(),
  signUp: jest.fn(),
  previousSignupData: {
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
    postalCode: '',
  },
}

const specificUserAges = [15, 16, 17, 18]
// null is the return value of storage when there is no value corresponding to the key
const nonSpecificUserAges = [null, NonEligible.UNDER_15, NonEligible.OVER_18]

jest.mock('features/auth/context/SettingsContext')

describe('<SetBirthday />', () => {
  beforeEach(async () => {
    mockdate.set(CURRENT_DATE)
    await storage.clear('user_age')
  })

  it('should render correctly', () => {
    render(<SetBirthday {...props} />)

    expect(screen).toMatchSnapshot()
  })

  it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
    render(<SetBirthday {...props} />)

    const datePicker = screen.getByTestId('date-picker-spinner-native')
    fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

    const continueButton = screen.getByTestId('Continuer')
    fireEvent.press(continueButton)

    expect(props.goToNextStep).toBeCalledWith({
      birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
    })
  })

  it.each(nonSpecificUserAges)(
    'should set default date when no specific user age in local storage',
    (userAge) => {
      storage.saveObject('user_age', userAge)
      render(<SetBirthday {...props} />)

      const datePicker = screen.getByTestId('date-picker-spinner-native')

      expect(datePicker.props.date).toBe(DEFAULT_SELECTED_DATE.getTime())
    }
  )

  it.each(specificUserAges)(
    'should set default year to user birth year when user age is in local storage',
    async (userAge) => {
      storage.saveObject('user_age', userAge)
      render(<SetBirthday {...props} />)

      const datePicker = await screen.findByTestId('date-picker-spinner-native')
      const spinnerDate = new Date(datePicker.props.date)

      expect(spinnerDate.getDate()).toBe(1)
      expect(spinnerDate.getMonth()).toBe(11)
      expect(spinnerDate.getFullYear()).toBe(2020 - userAge)
    }
  )

  it('should set a default birthdate if the user has already added his birthdate', () => {
    const propsWithPreviousBirthdate = {
      ...props,
      previousSignupData: {
        ...props.previousSignupData,
        birthdate: '12-11-1994',
      },
    }
    render(<SetBirthday {...propsWithPreviousBirthdate} />)

    const datePicker = screen.getByTestId('date-picker-spinner-native')
    expect(datePicker.props.date).toBe(new Date('1994-12-11').getTime())
  })
})
