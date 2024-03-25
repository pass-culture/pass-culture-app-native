import React from 'react'

import { CAPITALIZED_MONTHS } from 'shared/date/months'
import { render } from 'tests/utils'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown'

describe('<DropDown />', () => {
  it('should not render component when is native', () => {
    const { toJSON } = render(
      <DropDown
        label="Mois"
        placeholder="Mois"
        options={[...CAPITALIZED_MONTHS]}
        onChange={jest.fn()}
      />
    )

    expect(toJSON()).not.toBeOnTheScreen()
  })
})
