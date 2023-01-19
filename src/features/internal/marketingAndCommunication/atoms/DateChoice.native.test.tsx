import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE, ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { DateChoice } from 'features/internal/marketingAndCommunication/atoms/DateChoice'
import { fireEvent, render } from 'tests/utils'

const onChange = jest.fn()

describe('<DateChoice />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    onChange.mockReset()
    jest.useFakeTimers()
  })

  it('should call onChange with new Date', () => {
    const onChange = jest.fn()
    const renderAPI = render(<DateChoice onChange={onChange} />)

    const datePicker = renderAPI.getByTestId('date-picker-spinner-native')
    fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

    expect(onChange).toBeCalledWith(ELIGIBLE_AGE_DATE)
  })
})
