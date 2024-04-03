import mockdate from 'mockdate'
import React from 'react'

import {
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
  ELIGIBLE_AGE_DATE,
  MAXIMUM_DATE,
  MINIMUM_DATE,
} from 'features/auth/fixtures/fixtures'
import { fireEvent, render, screen } from 'tests/utils'

import { DatePickerSpinner } from './DatePickerSpinner'

const props = {
  onChange: jest.fn(),
  date: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  maximumDate: MAXIMUM_DATE,
}

jest.useFakeTimers()

describe('<DatePickerSpinner />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  describe('- navigation -', () => {
    it('should keep disabled the button "Continuer" when the date is not selected', () => {
      render(<DatePickerSpinner {...props} />)

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: CURRENT_DATE } })

      expect(props.onChange).toHaveBeenCalledWith(CURRENT_DATE)
    })

    it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
      render(<DatePickerSpinner {...props} />)

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

      expect(props.onChange).toHaveBeenCalledWith(ELIGIBLE_AGE_DATE)
    })
  })
})
