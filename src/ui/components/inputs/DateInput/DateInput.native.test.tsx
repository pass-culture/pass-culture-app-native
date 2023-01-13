import mockdate from 'mockdate'
import React from 'react'

import {
  MINIMUM_DATE,
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
} from 'features/auth/pages/signup/SetBirthday/utils/fixtures'
import { render } from 'tests/utils'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
}

describe('<DateInput />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should render correctly', () => {
    const { queryByTestId } = render(<DateInput {...props} />)
    expect(queryByTestId('date-picker-spinner-native')).toBeTruthy()
    expect(queryByTestId('date-picker-dropdown')).toBeNull()
    expect(queryByTestId('date-picker-spinner-touch')).toBeNull()
  })
})
