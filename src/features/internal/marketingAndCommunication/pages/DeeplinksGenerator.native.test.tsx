import React from 'react'

import { DeeplinksGenerator } from 'features/internal/marketingAndCommunication/pages/DeeplinksGenerator'
import { render } from 'tests/utils'

describe('<DeeplinksGenerator />', () => {
  it('should render DeeplinksGenerator', () => {
    expect(render(<DeeplinksGenerator />)).toMatchSnapshot()
  })
})
