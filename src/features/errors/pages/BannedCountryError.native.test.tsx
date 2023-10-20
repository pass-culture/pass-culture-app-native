import React from 'react'

import { render, screen } from 'tests/utils'

import { BannedCountryError } from './BannedCountryError'

jest.mock('react-query')

describe('BannedCountryError', () => {
  it('should render correctly', () => {
    render(<BannedCountryError />)
    expect(screen).toMatchSnapshot()
  })
})
