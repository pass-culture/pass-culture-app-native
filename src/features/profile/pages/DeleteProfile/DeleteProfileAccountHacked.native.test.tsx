import React from 'react'

import { render, screen } from 'tests/utils'

import { DeleteProfileAccountHacked } from './DeleteProfileAccountHacked'

describe('DeleteProfileAccountHacked', () => {
  it('should render correctly', () => {
    render(<DeleteProfileAccountHacked />)

    expect(screen).toMatchSnapshot()
  })
})
