import mockdate from 'mockdate'
import React from 'react'

import { MINIMUM_DATE, CURRENT_DATE, DEFAULT_SELECTED_DATE } from 'features/auth/fixtures/fixtures'
import { fireEvent, render } from 'tests/utils/web'
import { DatePickerSpinner } from 'ui/components/inputs/DateInput/DatePicker/DatePickerSpinner.web'

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
}

describe('<DatePickerSpinner />', () => {
  mockdate.set(CURRENT_DATE)
  props.onChange.mockReset()

  it('should call onChange with the selected date when a date is selected', () => {
    // FIXME(LucasBeneston): This warning comes from react-native-date-picker
    jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

    const { container } = render(<DatePickerSpinner {...props} />)

    const day = container.getElementsByClassName('picker-scroller')[0].childNodes[1] // 02
    fireEvent.click(day)

    const month = container.getElementsByClassName('picker-scroller')[1].childNodes[6] // Juillet
    fireEvent.click(month)

    const year = container.getElementsByClassName('picker-scroller')[2].childNodes[2] // 2004
    fireEvent.click(year)

    expect(props.onChange).toHaveBeenNthCalledWith(1, DEFAULT_SELECTED_DATE) // first render trigger useEffect
    expect(props.onChange).toHaveBeenNthCalledWith(2, new Date('2006-12-02T00:00:00.000Z'))
    expect(props.onChange).toHaveBeenNthCalledWith(3, new Date('2006-07-02T00:00:00.000Z'))
    expect(props.onChange).toHaveBeenNthCalledWith(4, new Date('2004-07-02T00:00:00.000Z'))
  })
})
