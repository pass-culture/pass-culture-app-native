import React from 'react'

import { render, screen } from 'tests/utils'

import { HomeBodyPlaceholder } from './HomeBodyPlaceholder'

jest.useFakeTimers()

describe('HomeBodyPlaceholder', () => {
  it('matches snapshot', () => {
    render(<HomeBodyPlaceholder />)

    expect(screen).toMatchSnapshot()
  })
})
