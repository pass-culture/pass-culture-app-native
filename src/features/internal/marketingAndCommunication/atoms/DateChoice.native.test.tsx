import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE, ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { DateChoice } from 'features/internal/marketingAndCommunication/atoms/DateChoice'
import { fireEvent, render, screen } from 'tests/utils'

const onChange = jest.fn()

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<DateChoice />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    onChange.mockReset()
  })

  it('should call onChange with new Date', () => {
    const onChange = jest.fn()
    render(<DateChoice onChange={onChange} />)

    const datePicker = screen.getByTestId('date-picker-spinner-native')
    fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

    expect(onChange).toBeCalledWith(ELIGIBLE_AGE_DATE)
  })
})
