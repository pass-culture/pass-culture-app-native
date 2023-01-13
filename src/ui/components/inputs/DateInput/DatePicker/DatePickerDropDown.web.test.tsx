import mockdate from 'mockdate'
import React from 'react'

import { MINIMUM_DATE, CURRENT_DATE, DEFAULT_SELECTED_DATE } from 'features/auth/fixtures/fixtures'
import { fireEvent, render } from 'tests/utils/web'
import { DatePickerDropDown } from 'ui/components/inputs/DateInput/DatePicker/DatePickerDropDown.web'

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
}

describe('<DatePickerDropDown />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    props.onChange.mockReset()
  })

  it('should call onChange with undefined date when a date is not selected', () => {
    const { getByTestId } = render(<DatePickerDropDown {...props} />)

    fireEvent.change(getByTestId('select-Jour'), { target: { value: '' } })
    fireEvent.change(getByTestId('select-Mois'), { target: { value: '' } })
    fireEvent.change(getByTestId('select-Année'), { target: { value: '' } })

    expect(props.onChange).toHaveBeenCalledWith(undefined) // first render trigger useEffect
  })

  it('should call onChange with the selected date when a date is selected', () => {
    const { getByTestId } = render(<DatePickerDropDown {...props} />)

    fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
    fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Janvier' } })
    fireEvent.change(getByTestId('select-Année'), { target: { value: '1994' } })

    expect(props.onChange).toHaveBeenNthCalledWith(1, undefined) // first render trigger useEffect
    expect(props.onChange).toHaveBeenNthCalledWith(2, new Date('1994-01-01T00:00:00.000Z'))
  })
})
