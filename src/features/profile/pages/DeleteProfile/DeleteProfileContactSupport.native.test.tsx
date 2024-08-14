import React from 'react'

import { render, screen } from 'tests/utils'

import { DeleteProfileContactSupport } from './DeleteProfileContactSupport'

describe('DeleteProfileContactSupport', () => {
  it('should render correctly', () => {
    render(<DeleteProfileContactSupport />)

    expect(screen).toMatchSnapshot()
  })
})
