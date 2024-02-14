import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { BannedCountryError } from './BannedCountryError'

describe('BannedCountryError', () => {
  it('should render correctly', () => {
    render(reactQueryProviderHOC(<BannedCountryError />))

    expect(screen).toMatchSnapshot()
  })
})
