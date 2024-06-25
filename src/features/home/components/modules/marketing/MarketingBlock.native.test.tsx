import React from 'react'
import { Text } from 'react-native'

import { render, screen } from 'tests/utils'

import { MarketingBlock, MarketingBlockProps } from './MarketingBlock'

const props: MarketingBlockProps = {
  accessibilityLabel: 'Accessibility label',
  navigateTo: { screen: 'Venue' as const },
  backgroundImageUrl: 'url',
  AttachedCardComponent: <Text>AttachedCardComponent</Text>,
}

describe('MarketingBlock', () => {
  it('should not render MarketingBlockContentDesktop when isDesktopViewport is false', () => {
    render(<MarketingBlock {...props} />, {
      theme: { isDesktopViewport: false },
    })

    expect(screen.queryByTestId('MarketingBlockContentDesktop')).not.toBeOnTheScreen()
  })

  it('should render MarketingBlockContentDesktop when isDesktopViewport is true', () => {
    render(<MarketingBlock {...props} />, {
      theme: { isDesktopViewport: true },
    })

    expect(screen.getByTestId('MarketingBlockContentDesktop')).toBeOnTheScreen()
  })
})
