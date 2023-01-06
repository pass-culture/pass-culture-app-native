import React from 'react'

import { render } from 'tests/utils'

import { PageNotFound } from './PageNotFound'

describe('<PageNotFound/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<PageNotFound />)
    expect(renderAPI).toMatchSnapshot()
  })
})
