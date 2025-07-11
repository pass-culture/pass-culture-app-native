import React from 'react'

import { render, screen } from 'tests/utils'

import { Maintenance } from './Maintenance'

jest.mock('libs/firebase/analytics/analytics')

describe('<Maintenance />', () => {
  it('should match snapshot with default message', () => {
    render(<Maintenance />)

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with custom message', () => {
    render(<Maintenance message="C’est tout cassé&nbsp;! Reviens plus tard" />)

    expect(screen).toMatchSnapshot()
  })
})
