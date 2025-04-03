import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'
import { Typo } from 'ui/theme'

import { SecondaryPageWithBlurHeader } from './SecondaryPageWithBlurHeader'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SecondaryPageWithBlurHeader />', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = render(
      <SecondaryPageWithBlurHeader
        title="SecondaryPageWithBlurHeader"
        shouldDisplayBackButton
        onGoBack={jest.fn}>
        <Typo.Body>Children</Typo.Body>
      </SecondaryPageWithBlurHeader>
    )

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
