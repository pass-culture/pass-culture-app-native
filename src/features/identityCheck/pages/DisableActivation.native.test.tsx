import React from 'react'

import { DisableActivation } from 'features/identityCheck/pages/DisableActivation'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('<DisableActivation/>', () => {
  it('should render correctly', () => {
    render(<DisableActivation />)

    expect(screen).toMatchSnapshot()
  })
})
