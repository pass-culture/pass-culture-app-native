import React from 'react'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render } from 'tests/utils'

import { DateInput, DateInputRef } from './DateInput'

describe('DateInput Component', () => {
  it('should render ref and give access to clearFocuses function', () => {
    const myRef = React.createRef<DateInputRef>()
    render(<DateInput ref={myRef} />)
    expect(myRef.current).toBeTruthy()
    expect(myRef.current && myRef.current.clearFocuses).toBeTruthy()
  })

  it('should render input correctly', () => {
    const { getByPlaceholderText, queryByText } = render(<DateInput />)

    const dateInput = getByPlaceholderText('03/03/2003')

    expect(dateInput).toBeTruthy()
    expect(queryByText('Date de naissance')).toBeTruthy()
  })

  it('should call onChangeValue with correct date', () => {
    const onChangeValue = jest.fn()
    const { getByPlaceholderText } = render(<DateInput onChangeValue={onChangeValue} />)

    const dateInput = getByPlaceholderText('03/03/2003')
    fireEvent.changeText(dateInput, '25101991') // 25/10/1991

    expect(onChangeValue).toHaveBeenCalledWith(new Date('1991-10-25'), {
      isComplete: true,
      isValid: true,
      isDateAboveMin: true,
      isDateBelowMax: true,
    })
  })

  it('should call onChangeValue with incorrect date', () => {
    const onChangeValue = jest.fn()
    const { getByPlaceholderText } = render(<DateInput onChangeValue={onChangeValue} />)

    const dateInput = getByPlaceholderText('03/03/2003')
    fireEvent.changeText(dateInput, '32131991') // 32/13/1991

    expect(onChangeValue).toHaveBeenCalledWith(null, {
      isComplete: false,
      isValid: false,
      isDateAboveMin: true,
      isDateBelowMax: true,
    })
  })

  it('should call onChangeValue with incomplete date', async () => {
    const onChangeValue = jest.fn()
    const { getByPlaceholderText } = render(<DateInput onChangeValue={onChangeValue} />)

    const dateInput = getByPlaceholderText('03/03/2003')
    fireEvent.changeText(dateInput, '3213199') // 32/13/199

    await waitForExpect(() => {
      expect(onChangeValue).toHaveBeenCalledWith(null, {
        isComplete: false,
        isValid: false,
        isDateAboveMin: true,
        isDateBelowMax: true,
      })
    })
  })
})
