import React from 'react'

import { render } from 'tests/utils'

import { LandscapePositionPage } from '../LandscapePositionPage'

describe('<LandscapePositionPage />', () => {
  it('should match snapshot with default message', () => {
    const landscapePositionPage = render(<LandscapePositionPage />)
    expect(landscapePositionPage).toMatchSnapshot()
  })
})
