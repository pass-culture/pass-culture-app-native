import React from 'react'

import { render, screen } from 'tests/utils'
import { TypoDS } from 'ui/theme'

import { SecondaryPageWithBlurHeader } from './SecondaryPageWithBlurHeader'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SecondaryPageWithBlurHeader />', () => {
  it('should render correctly', () => {
    render(
      <SecondaryPageWithBlurHeader title="SecondaryPageWithBlurHeader">
        <TypoDS.Title3>Children</TypoDS.Title3>
      </SecondaryPageWithBlurHeader>
    )

    expect(screen).toMatchSnapshot()
  })
})
