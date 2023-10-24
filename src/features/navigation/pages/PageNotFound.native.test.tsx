import React from 'react'

import { render, screen } from 'tests/utils'

import { PageNotFound } from './PageNotFound'

describe('<PageNotFound/>', () => {
  it('should render correctly', () => {
    render(<PageNotFound />)

    expect(screen).toMatchSnapshot()
  })
})
