import React from 'react'

import { render, screen } from 'tests/utils'

import { OfflinePage } from './OfflinePage'

describe('<OfflinePage />', () => {
  it('should match snapshot with default message', () => {
    render(<OfflinePage />)

    expect(screen).toMatchSnapshot()
  })
})
