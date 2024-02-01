import React from 'react'

import { MINIMUM_DATE, DEFAULT_SELECTED_DATE, MAXIMUM_DATE } from 'features/auth/fixtures/fixtures'
import { render } from 'tests/utils'
import { DatePickerDropDown } from 'ui/components/inputs/DateInput/DatePicker/DatePickerDropDown'

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  maximumDate: MAXIMUM_DATE,
}

describe('<DatePickerDropDown />', () => {
  it('should not render component when is native', () => {
    const { toJSON } = render(<DatePickerDropDown {...props} />)

    expect(toJSON()).not.toBeOnTheScreen()
  })
})
