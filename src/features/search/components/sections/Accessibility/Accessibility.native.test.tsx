import React from 'react'

import { Accessibility } from 'features/search/components/sections/Accessibility/Accessibility'
import { render } from 'tests/utils'

describe('Category component', () => {
  it('should render correctly', () => {
    expect(render(<Accessibility />)).toMatchSnapshot()
  })
})
