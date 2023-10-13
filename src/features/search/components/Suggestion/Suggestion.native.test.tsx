import React from 'react'

import { Suggestion } from 'features/search/components/Suggestion/Suggestion'
import { render, screen } from 'tests/utils'

describe('Suggestion', () => {
  it('should display component correctly', () => {
    render(<Suggestion suggestion="test" />)
    expect(screen).toMatchSnapshot()
  })
})
