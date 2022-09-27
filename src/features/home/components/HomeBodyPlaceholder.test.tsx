import React from 'react'

import { render } from 'tests/utils'

import { HomeBodyPlaceholder } from './HomeBodyPlaceholder'

describe('HomeBodyPlaceholder', () => {
  it('matches snapshot', () => {
    const homeBodyPlaceholder = render(<HomeBodyPlaceholder />)
    expect(homeBodyPlaceholder).toMatchSnapshot()
  })
})
