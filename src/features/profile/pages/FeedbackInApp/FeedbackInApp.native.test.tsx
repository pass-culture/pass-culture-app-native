import React from 'react'

import { render } from 'tests/utils'

import { FeedbackInApp } from './FeedbackInApp'

describe('<FeedbackInApp/>', () => {
  it('should match snapshot', () => {
    render(<FeedbackInApp />)

    expect(screen).toMatchSnapshot()
  })
})
