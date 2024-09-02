import React from 'react'

import { FAQWebview } from 'features/culturalSurvey/pages/FAQWebview'
import { render, screen } from 'tests/utils'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('FAQVebview page', () => {
  it('should render the page with correct layout', () => {
    render(<FAQWebview />)

    expect(screen).toMatchSnapshot()
  })
})
