import mockdate from 'mockdate'
import React from 'react'

import { MINIMUM_YEAR } from 'features/auth/signup/SetBirthday/utils/constants'
import {
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
} from 'features/auth/signup/SetBirthday/utils/fixtures'
import { fireEvent, render } from 'tests/utils/web'

import { DatePickerDropDown } from './DatePickerDropDown.web'

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumYear: MINIMUM_YEAR,
}

jest.mock('features/auth/settings')

describe('<DatePickerDropDown />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  it('should call onChange with undefined date when a date is not selected', () => {
    const { getByTestId } = render(<DatePickerDropDown {...props} />)

    fireEvent.change(getByTestId('select-Jour'), { target: { value: '' } })
    fireEvent.change(getByTestId('select-Mois'), { target: { value: '' } })
    fireEvent.change(getByTestId('select-Année'), { target: { value: '' } })

    expect(props.onChange).toBeCalledWith(undefined)
  })

  it('should call onChange with the selected date when a date is selected', () => {
    const { getByTestId } = render(<DatePickerDropDown {...props} />)

    fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
    fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Janvier' } })
    fireEvent.change(getByTestId('select-Année'), { target: { value: '1994' } })

    expect(props.onChange).toBeCalledWith('1994-01-01T00:00:00.000Z')
  })
})
