import React from 'react'

import { monthNames } from 'features/bookOffer/components/Calendar/Calendar.utils'
import { render } from 'tests/utils'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown'

describe('<DropDown />', () => {
  it('should not render component when is native', () => {
    const renderAPI = render(
      <DropDown label="Mois" placeholder="MM" options={monthNames} onChange={jest.fn()} />
    )
    expect(renderAPI.toJSON()).toBeNull()
  })
})
