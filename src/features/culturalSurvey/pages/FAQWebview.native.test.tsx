import React from 'react'

import { FAQWebview } from 'features/culturalSurvey/pages/FAQWebview'
import { render, screen } from 'tests/utils'

describe('FAQVebview page', () => {
  it('should render the page with correct layout', () => {
    render(<FAQWebview />)
    expect(screen).toMatchSnapshot()
  })
})
