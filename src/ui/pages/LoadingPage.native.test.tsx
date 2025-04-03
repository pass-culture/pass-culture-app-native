import React from 'react'

import { render, screen } from 'tests/utils'

import { LoadingPage } from './LoadingPage'

describe('<LoadingPage />', () => {
  it('should render correctly', () => {
    render(<LoadingPage />)

    expect(screen).toMatchSnapshot()
  })
})
