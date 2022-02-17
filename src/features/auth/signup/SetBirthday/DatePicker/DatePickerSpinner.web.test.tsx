import mockdate from 'mockdate'
import React from 'react'

import { MINIMUM_YEAR } from 'features/auth/signup/SetBirthday/utils/constants'
import { fireEvent, render } from 'tests/utils/web'

import { DatePickerSpinner } from './DatePickerSpinner.web'

const CURRENT_DATE = new Date('2020-01-01T00:00:00.000Z')
const DEFAULT_SELECTED_DATE = new Date('2006-06-01T00:00:00.000Z')

const props = {
  onChange: jest.fn(),
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumYear: MINIMUM_YEAR,
}

jest.mock('features/auth/settings')

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ warn: true })

describe('<DatePickerSpinner />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  it('should call onChange with the selected date when a date is selected', () => {
    const { container } = render(<DatePickerSpinner {...props} />)

    const day = container.getElementsByClassName('picker-scroller')[0].childNodes[0] // 01
    fireEvent.click(day)

    const month = container.getElementsByClassName('picker-scroller')[1].childNodes[11] // Décembre
    fireEvent.click(month)

    const year = container.getElementsByClassName('picker-scroller')[2].childNodes[4] // 2004
    fireEvent.click(year)

    expect(props.onChange).toBeCalledWith('1994-01-01T00:00:00.000Z')
  })
})
