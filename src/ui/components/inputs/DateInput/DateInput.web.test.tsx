import mockdate from 'mockdate'
import React from 'react'

import {
  MINIMUM_DATE,
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
} from 'features/auth/signup/SetBirthday/utils/fixtures'
import { render } from 'tests/utils/web'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
}

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ warn: true })

describe('<DateInput />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  describe('touch device', () => {
    it('should render correctly', () => {
      const { queryByTestId } = render(<DateInput {...props} />, { theme: { isTouch: true } })
      expect(queryByTestId('date-picker-spinner-touch')).toBeTruthy()
      expect(queryByTestId('date-picker-spinner-native')).toBeFalsy()
      expect(queryByTestId('date-picker-dropdown')).toBeFalsy()
    })
  })

  describe('no touch device', () => {
    it('should render correctly', () => {
      const { queryByTestId } = render(<DateInput {...props} />, { theme: { isTouch: false } })
      expect(queryByTestId('date-picker-dropdown')).toBeTruthy()
      expect(queryByTestId('date-picker-spinner-native')).toBeFalsy()
      expect(queryByTestId('date-picker-spinner-touch')).toBeFalsy()
    })
  })
})
