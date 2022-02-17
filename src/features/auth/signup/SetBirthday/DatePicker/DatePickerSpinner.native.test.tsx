import mockdate from 'mockdate'
import React from 'react'

import { MINIMUM_DATE } from 'features/auth/signup/SetBirthday/utils/constants'
import { fireEvent, render } from 'tests/utils'

import { DatePickerSpinner } from './DatePickerSpinner'

const CURRENT_DATE = new Date('2020-01-01T00:00:00.000Z')
const ELIGIBLE_AGE_DATE = new Date('2003-01-01T00:00:00.000Z')
const MAXIMUM_DATE = new Date('2003-12-01T00:00:00.000Z')
const DEFAULT_SELECTED_DATE = new Date('2006-06-01T00:00:00.000Z')

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  maximumDate: MAXIMUM_DATE,
}

jest.mock('features/auth/settings')

describe('<DatePickerSpinner />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  describe('- navigation -', () => {
    it('should keep disabled the button "Continuer" when the date is not selected', () => {
      const { getByTestId } = render(<DatePickerSpinner {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: CURRENT_DATE } })

      expect(props.onChange).toBeCalledWith(CURRENT_DATE)
    })

    it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
      const { getByTestId } = render(<DatePickerSpinner {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

      expect(props.onChange).toBeCalledWith(ELIGIBLE_AGE_DATE)
    })
  })
})
