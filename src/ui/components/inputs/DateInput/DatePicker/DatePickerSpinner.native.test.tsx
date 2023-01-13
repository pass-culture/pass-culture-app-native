import mockdate from 'mockdate'
import React from 'react'

import {
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
  ELIGIBLE_AGE_DATE,
  MAXIMUM_DATE,
  MINIMUM_DATE,
} from 'features/auth/fixtures/fixtures'
import { fireEvent, render } from 'tests/utils'

import { DatePickerSpinner } from './DatePickerSpinner'

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  maximumDate: MAXIMUM_DATE,
}

describe('<DatePickerSpinner />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  describe('- navigation -', () => {
    it('should keep disabled the button "Continuer" when the date is not selected', () => {
      const { getByTestId } = render(<DatePickerSpinner {...props} />)

      const datePicker = getByTestId('date-picker-spinner-native')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: CURRENT_DATE } })

      expect(props.onChange).toBeCalledWith(CURRENT_DATE)
    })

    it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
      const { getByTestId } = render(<DatePickerSpinner {...props} />)

      const datePicker = getByTestId('date-picker-spinner-native')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

      expect(props.onChange).toBeCalledWith(ELIGIBLE_AGE_DATE)
    })
  })
})
