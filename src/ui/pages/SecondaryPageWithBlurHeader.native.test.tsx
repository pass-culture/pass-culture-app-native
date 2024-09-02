import React from 'react'

import { render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

import { SecondaryPageWithBlurHeader } from './SecondaryPageWithBlurHeader'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<SecondaryPageWithBlurHeader />', () => {
  it('should render correctly', () => {
    render(
      <SecondaryPageWithBlurHeader title="GenericInfoPageWhite">
        <Typo.Title3>Children</Typo.Title3>
      </SecondaryPageWithBlurHeader>
    )

    expect(screen).toMatchSnapshot()
  })
})
