import React from 'react'

import { render, screen } from 'tests/utils'

import { DeleteProfileAccountNotDeletable } from './DeleteProfileAccountNotDeletable'

jest.mock('libs/firebase/analytics/analytics')

describe('DeleteProfileAccountNotDeletable', () => {
  it('should render correctly', () => {
    render(<DeleteProfileAccountNotDeletable />)

    expect(screen).toMatchSnapshot()
  })
})
