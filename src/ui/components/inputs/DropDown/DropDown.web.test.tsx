import React from 'react'

import { monthNames } from 'features/bookOffer/components/Calendar/Calendar.utils'
import { fireEvent, render, screen } from 'tests/utils/web'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown.web'

describe('<DropDown />', () => {
  it('should correctly set default option', () => {
    render(<DropDown label="Mois" placeholder="MM" options={monthNames} onChange={jest.fn()} />)
    expect((screen.getByRole('option', { name: 'MM' }) as HTMLOptionElement).selected).toBe(true)
  })

  it('should select correct month on change', () => {
    const onChange = jest.fn()
    render(<DropDown label="Mois" placeholder="MM" options={monthNames} onChange={onChange} />)

    fireEvent.change(screen.getByTestId('select-Mois'), { target: { value: monthNames[2] } })

    expect(onChange).toBeCalledWith(monthNames[2])
  })
})
