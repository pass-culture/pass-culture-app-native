import mockdate from 'mockdate'
import React from 'react'

import { MINIMUM_DATE, CURRENT_DATE, DEFAULT_SELECTED_DATE } from 'features/auth/fixtures/fixtures'
import { render, screen } from 'tests/utils/web'
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

  describe('touch device', () => {
    it('should render correctly', () => {
      // FIXME(PC-211174): This warning comes from react-native-date-picker (https://passculture.atlassian.net/browse/PC-21174)
      jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

      render(<DateInput {...props} />, { theme: { isTouch: true } })
      expect(screen.queryByTestId('date-picker-spinner-touch')).toBeTruthy()
      expect(screen.queryByTestId('date-picker-spinner-native')).toBeFalsy()
      expect(screen.queryByTestId('date-picker-dropdown')).toBeFalsy()
    })
  })

  describe('no touch device', () => {
    it('should render correctly', () => {
      render(<DateInput {...props} />, { theme: { isTouch: false } })
      expect(screen.queryByTestId('date-picker-dropdown')).toBeTruthy()
      expect(screen.queryByTestId('date-picker-spinner-native')).toBeFalsy()
      expect(screen.queryByTestId('date-picker-spinner-touch')).toBeFalsy()
    })
  })
})
