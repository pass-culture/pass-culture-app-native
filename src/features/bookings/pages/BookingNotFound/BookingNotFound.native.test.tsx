import React from 'react'

import { render } from 'tests/utils'

import { BookingNotFound } from './BookingNotFound'

describe('<BookingNotFound/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />
    )
    expect(renderAPI).toMatchSnapshot()
  })
})
