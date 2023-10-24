import React from 'react'

import { render, screen } from 'tests/utils'

import { BookingNotFound } from './BookingNotFound'

describe('<BookingNotFound/>', () => {
  it('should render correctly', () => {
    render(<BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />)

    expect(screen).toMatchSnapshot()
  })
})
