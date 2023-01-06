import React from 'react'

import { render } from 'tests/utils'

import { BannedCountryError } from './BannedCountryError'

jest.mock('react-query')

describe('BannedCountryError', () => {
  it('should render correctly', () => {
    const renderAPI = render(<BannedCountryError />)
    expect(renderAPI).toMatchSnapshot()
  })
})
