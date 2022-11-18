import React from 'react'

import { Suggestion } from 'features/search/components/Suggestion/Suggestion'
import { render } from 'tests/utils'

describe('Suggestion', () => {
  it('should display component correctly', () => {
    const component = render(<Suggestion suggestion="test" />)
    expect(component).toMatchSnapshot()
  })
})
