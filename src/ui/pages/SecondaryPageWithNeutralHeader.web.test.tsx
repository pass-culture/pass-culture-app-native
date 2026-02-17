import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'
import { Typo } from 'ui/theme'

import { SecondaryPageWithNeutralHeader } from './SecondaryPageWithNeutralHeader'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SecondaryPageWithBlurHeader />', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = render(
      <SecondaryPageWithNeutralHeader
        title="SecondaryPageWithBlurHeader"
        shouldDisplayBackButton
        onGoBack={jest.fn}>
        <Typo.Body>Children</Typo.Body>
      </SecondaryPageWithNeutralHeader>
    )

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
