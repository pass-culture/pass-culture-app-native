import React from 'react'

import { render, screen } from 'tests/utils'

import { DeleteProfileEmailHacked } from './DeleteProfileEmailHacked'

describe('DeleteProfileEmailHacked', () => {
  it('should render correctly', () => {
    render(<DeleteProfileEmailHacked />)

    expect(screen).toMatchSnapshot()
  })
})
