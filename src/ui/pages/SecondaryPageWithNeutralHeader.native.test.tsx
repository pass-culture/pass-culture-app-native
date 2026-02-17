import React from 'react'

import { render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

import { SecondaryPageWithNeutralHeader } from './SecondaryPageWithNeutralHeader'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SecondaryPageWithBlurHeader />', () => {
  it('should render correctly', () => {
    render(
      <SecondaryPageWithNeutralHeader
        title="SecondaryPageWithBlurHeader"
        shouldDisplayBackButton
        onGoBack={jest.fn}>
        <Typo.Title2>Children</Typo.Title2>
      </SecondaryPageWithNeutralHeader>
    )

    expect(screen).toMatchSnapshot()
  })
})
