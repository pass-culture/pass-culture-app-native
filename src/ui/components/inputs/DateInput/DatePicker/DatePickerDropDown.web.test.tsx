import mockdate from 'mockdate'
import React from 'react'

import { MINIMUM_DATE, CURRENT_DATE, DEFAULT_SELECTED_DATE } from 'features/auth/fixtures/fixtures'
import { fireEvent, render, screen } from 'tests/utils/web'
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

  it('should set an empty default date if the user has not added his birthdate', async () => {
    const propsWithoutDefaultDate = { ...props, previousBirthdateProvided: undefined }
    render(<DatePickerDropDown {...propsWithoutDefaultDate} />)

    expect(screen.getByTestId('select-Jour')).toHaveValue('')
    expect(screen.getByTestId('select-Mois')).toHaveValue('')
    expect(screen.getByTestId('select-Année')).toHaveValue('')
  })

  it('should set a default date if the user has already added his birthdate', async () => {
    const propsWithDefaultDate = { ...props, previousBirthdateProvided: '1994-11-12' }
    render(<DatePickerDropDown {...propsWithDefaultDate} />)

    expect(screen.getByTestId('select-Jour')).toHaveValue('12')
    expect(screen.getByTestId('select-Mois')).toHaveValue('Novembre')
    expect(screen.getByTestId('select-Année')).toHaveValue('1994')
  })

  it('should call onChange with undefined date when a date is not selected', () => {
    render(<DatePickerDropDown {...props} />)

    fireEvent.change(screen.getByTestId('select-Jour'), { target: { value: '' } })
    fireEvent.change(screen.getByTestId('select-Mois'), { target: { value: '' } })
    fireEvent.change(screen.getByTestId('select-Année'), { target: { value: '' } })

    expect(props.onChange).toHaveBeenNthCalledWith(1, undefined) // first render trigger useEffect
  })

  it('should call onChange with the selected date when a date is selected', () => {
    render(<DatePickerDropDown {...props} />)

    fireEvent.change(screen.getByTestId('select-Jour'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('select-Mois'), { target: { value: 'Janvier' } })
    fireEvent.change(screen.getByTestId('select-Année'), { target: { value: '1994' } })

    expect(props.onChange).toHaveBeenNthCalledWith(1, undefined) // first render trigger useEffect
    expect(props.onChange).toHaveBeenNthCalledWith(2, new Date('1994-01-01T00:00:00.000Z'))
  })
})
