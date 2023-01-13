import mockdate from 'mockdate'
import React from 'react'

import {
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
  ELIGIBLE_AGE_DATE,
} from 'features/auth/signup/SetBirthday/utils/fixtures'
import { NonEligible } from 'features/onboarding/types'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { storage } from 'libs/storage'
import { fireEvent, render } from 'tests/utils'

import { SetBirthday } from './SetBirthday'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

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
    const renderAPI = render(<SetBirthday {...props} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
    const { getByTestId } = render(<SetBirthday {...props} />)

    const datePicker = getByTestId('date-picker-spinner-native')
    fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

    const continueButton = getByTestId('Continuer')
    fireEvent.press(continueButton)

    expect(props.goToNextStep).toBeCalledWith({
      birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
    })
  })

  it.each(nonSpecificUserAges)(
    'should set default date when no specific user age in local storage',
    (userAge) => {
      storage.saveObject('user_age', userAge)
      const { getByTestId } = render(<SetBirthday {...props} />)

      const datePicker = getByTestId('date-picker-spinner-native')
      const defaultDate = datePicker.props.date

      expect(defaultDate).toBe(DEFAULT_SELECTED_DATE.getTime())
    }
  )

  it.each(specificUserAges)(
    'should set default year to user birth year when user age is in local storage',
    async (userAge) => {
      storage.saveObject('user_age', userAge)

      const { findByTestId } = render(<SetBirthday {...props} />)

      const datePicker = await findByTestId('date-picker-spinner-native')
      const spinnerDate = new Date(datePicker.props.date)

      expect(spinnerDate.getDate()).toBe(1)
      expect(spinnerDate.getMonth()).toBe(11)
      expect(spinnerDate.getFullYear()).toBe(2020 - userAge)
    }
  )
})
