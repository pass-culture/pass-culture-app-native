import React from 'react'

import {
  MINIMUM_DATE,
  DEFAULT_SELECTED_DATE,
} from 'features/auth/pages/signup/SetBirthday/utils/fixtures'
import { render } from 'tests/utils'
import { DatePickerDropDown } from 'ui/components/inputs/DateInput/DatePicker/DatePickerDropDown'

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
}

describe('<DatePickerDropDown />', () => {
  it('should not render component when is native', () => {
    const renderAPI = render(<DatePickerDropDown {...props} />)
    expect(renderAPI.toJSON()).toBeNull()
  })
})
