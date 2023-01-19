import React from 'react'

import { UTMParameters } from 'features/internal/marketingAndCommunication/pages/UTMParameters'
import { render } from 'tests/utils'

describe('<UTMParameters />', () => {
  it('should render correctly', () => {
    expect(render(<UTMParameters />)).toMatchSnapshot()
  })
})
