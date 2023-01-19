import mockdate from 'mockdate'
import React from 'react'

import { DateChoice } from 'features/_marketingAndCommunication/atoms/DateChoice'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { fireEvent, render } from 'tests/utils/web'

const onChange = jest.fn()

describe('<DateChoice />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    onChange.mockReset()
  })

  it('should call onChange with new Date', () => {
    const onChange = jest.fn()
    const renderAPI = render(<DateChoice onChange={onChange} />)

    fireEvent.change(renderAPI.getByTestId('select-Jour'), { target: { value: '31' } })
    fireEvent.change(renderAPI.getByTestId('select-Mois'), { target: { value: 'Décembre' } })
    fireEvent.change(renderAPI.getByTestId('select-Année'), { target: { value: '2020' } })

    expect(onChange).toHaveBeenNthCalledWith(1, undefined) // first render trigger useEffect
    expect(onChange).toHaveBeenNthCalledWith(2, new Date('2020-12-31T00:00:00.000Z'))
  })
})
