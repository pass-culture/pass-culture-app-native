import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { DateChoice } from 'features/internal/marketingAndCommunication/atoms/DateChoice'
import { fireEvent, render, screen } from 'tests/utils/web'

const onChange = jest.fn()

describe('<DateChoice />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    onChange.mockReset()
  })

  it('should call onChange with new Date', () => {
    const onChange = jest.fn()
    render(<DateChoice onChange={onChange} />)

    fireEvent.change(screen.getByTestId('select-Jour'), { target: { value: '31' } })
    fireEvent.change(screen.getByTestId('select-Mois'), { target: { value: 'Décembre' } })
    fireEvent.change(screen.getByTestId('select-Année'), { target: { value: '2020' } })

    expect(onChange).toHaveBeenNthCalledWith(1, undefined) // first render trigger useEffect
    expect(onChange).toHaveBeenNthCalledWith(2, new Date('2020-12-31T00:00:00.000Z'))
  })
})
