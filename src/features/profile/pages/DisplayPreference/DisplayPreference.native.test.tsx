import React from 'react'

import { render, screen } from 'tests/utils'

import { DisplayPreference } from './DisplayPreference'

describe('debouncedLogChangeOrientationToggle', () => {
  it('should render correctly', () => {
    render(<DisplayPreference />)

    expect(screen).toMatchSnapshot()
  })
})
