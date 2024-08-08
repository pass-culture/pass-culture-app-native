import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { FeedbackInApp } from './FeedbackInApp'

jest.mock('libs/firebase/analytics/analytics')

describe('<FeedbackInApp/>', () => {
  it('should match snapshot', () => {
    render(reactQueryProviderHOC(<FeedbackInApp />))

    expect(screen).toMatchSnapshot()
  })
})
