import React from 'react'

import { monthNames } from 'shared/date/months'
import { render } from 'tests/utils'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown'

describe('<DropDown />', () => {
  it('should not render component when is native', () => {
    const { toJSON } = render(
      <DropDown label="Mois" placeholder="Mois" options={monthNames} onChange={jest.fn()} />
    )
    expect(toJSON()).not.toBeOnTheScreen()
  })
})
