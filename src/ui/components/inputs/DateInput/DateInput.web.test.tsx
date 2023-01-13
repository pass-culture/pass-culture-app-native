import mockdate from 'mockdate'
import React from 'react'

import { MINIMUM_DATE, CURRENT_DATE, DEFAULT_SELECTED_DATE } from 'features/auth/fixtures/fixtures'
import { render } from 'tests/utils/web'
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
      // FIXME(LucasBeneston): This warning comes from react-native-date-picker
      jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

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
