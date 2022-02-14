import React from 'react'

import { fireEvent, render } from 'tests/utils/web'
import { DropDown } from 'features/auth/signup/SetBirthday/atoms/DropDown/DropDown.web'
import { monthNames } from 'features/bookOffer/components/Calendar/Calendar.utils'

describe('<DropDown />', () => {
  it('should correctly set default option', () => {
    const { getByRole } = render(
      <DropDown label="Mois" placeholder="MM" options={monthNames} onChange={jest.fn()} />
    )
    expect((getByRole('option', { name: 'MM' }) as HTMLOptionElement).selected).toBe(true)
  })

  it('should select correct month on change', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <DropDown label="Mois" placeholder="MM" options={monthNames} onChange={onChange} />
    )

    fireEvent.change(getByTestId('select'), { target: { value: monthNames[2] } })

    expect(onChange).toBeCalledWith(monthNames[2])
  })
})
