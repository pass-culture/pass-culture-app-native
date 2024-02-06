import React from 'react'

import { CAPITALIZED_MONTHS } from 'shared/date/months'
import { fireEvent, render, screen } from 'tests/utils/web'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown.web'

describe('<DropDown />', () => {
  it('should correctly set default option', () => {
    render(
      <DropDown label="Mois" placeholder="Mois" options={CAPITALIZED_MONTHS} onChange={jest.fn()} />
    )

    expect((screen.getByRole('option', { name: 'Mois' }) as HTMLOptionElement).selected).toBe(true)
  })

  it('should select correct month on change', () => {
    const onChange = jest.fn()
    render(
      <DropDown label="Mois" placeholder="Mois" options={CAPITALIZED_MONTHS} onChange={onChange} />
    )

    fireEvent.change(screen.getByTestId('select-Mois'), {
      target: { value: CAPITALIZED_MONTHS[2] },
    })

    expect(onChange).toHaveBeenCalledWith(CAPITALIZED_MONTHS[2])
  })
})
