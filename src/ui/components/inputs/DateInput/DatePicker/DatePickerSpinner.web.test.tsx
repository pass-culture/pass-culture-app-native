import mockdate from 'mockdate'
import React from 'react'

import {
  MINIMUM_DATE,
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
  MAXIMUM_DATE,
} from 'features/auth/fixtures/fixtures'
import { act, fireEvent, render, screen } from 'tests/utils/web'
import { DatePickerSpinner } from 'ui/components/inputs/DateInput/DatePicker/DatePickerSpinner.web'

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  maximumDate: MAXIMUM_DATE,
}

describe('<DatePickerSpinner />', () => {
  mockdate.set(CURRENT_DATE)
  props.onChange.mockReset()

  it('should call onChange with the selected date when a date is selected', () => {
    // FIXME(PC-211174): This warning comes from react-native-date-picker (https://passculture.atlassian.net/browse/PC-21174)
    jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

    const { container } = render(<DatePickerSpinner {...props} />)

    const day = container.getElementsByClassName('picker-scroller')[0].childNodes[1] // 02
    fireEvent.click(day)

    const month = container.getElementsByClassName('picker-scroller')[1].childNodes[6] // 07
    fireEvent.click(month)

    const year = container.getElementsByClassName('picker-scroller')[2].childNodes[1] // 2005
    fireEvent.click(year)

    expect(props.onChange).toHaveBeenNthCalledWith(1, DEFAULT_SELECTED_DATE) // first render trigger useEffect
    expect(props.onChange).toHaveBeenNthCalledWith(2, DEFAULT_SELECTED_DATE)
    expect(props.onChange).toHaveBeenNthCalledWith(3, new Date('2006-12-02T00:00:00.000Z'))
    expect(props.onChange).toHaveBeenNthCalledWith(4, new Date('2006-07-02T00:00:00.000Z'))
    expect(props.onChange).toHaveBeenNthCalledWith(5, new Date('2005-07-02T00:00:00.000Z'))
  })

  it('should trigger hidden value change when value is valid iso date string', () => {
    // FIXME(PC-211174): This warning comes from react-native-date-picker (https://passculture.atlassian.net/browse/PC-21174)
    jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

    render(<DatePickerSpinner {...props} />)

    const hiddenInput = screen.getByTestId('hidden-input-birthdate')

    act(() => {
      fireEvent.change(hiddenInput, { target: { value: '1985-05-10T08:12:46.241Z' } })
    })

    expect(props.onChange).toHaveBeenCalledWith(new Date('1985-05-10T00:00:00.000Z'))
  })

  it('should not trigger hidden value change when value is invalid string', () => {
    // FIXME(PC-211174): This warning comes from react-native-date-picker (https://passculture.atlassian.net/browse/PC-21174)
    jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

    render(<DatePickerSpinner {...props} />)

    const hiddenInput = screen.getByTestId('hidden-input-birthdate')

    act(() => {
      fireEvent.change(hiddenInput, { target: { value: '1985-05-1008:12:46.241Z' } })
    })

    expect(props.onChange).not.toHaveBeenCalledWith(new Date('1985-05-10T00:00:00.000Z'))
  })
})
