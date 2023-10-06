import React from 'react'

import { EmptyCredit } from 'features/profile/components/EmptyCredit/EmptyCredit'
import { render, screen } from 'tests/utils'

describe('<EmptyCredit />', () => {
  it.each([15, 16, 17, 18])('should render correctly for %s yo', (age) => {
    render(<EmptyCredit age={age} />)

    expect(screen).toMatchSnapshot()
  })
})
