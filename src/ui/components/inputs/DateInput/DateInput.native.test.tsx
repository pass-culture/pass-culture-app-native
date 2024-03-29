import mockdate from 'mockdate'
import React from 'react'

import {
  MINIMUM_DATE,
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
  MAXIMUM_DATE,
} from 'features/auth/fixtures/fixtures'
import { render, screen } from 'tests/utils'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'

const props = {
  onChange: jest.fn(),
  date: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  maximumDate: MAXIMUM_DATE,
}

describe('<DateInput />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should render correctly', () => {
    render(<DateInput {...props} />)

    expect(screen.getByTestId('date-picker-spinner-native')).toBeOnTheScreen()
    expect(screen.queryByTestId('date-picker-dropdown')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('date-picker-spinner-touch')).not.toBeOnTheScreen()
  })
})
