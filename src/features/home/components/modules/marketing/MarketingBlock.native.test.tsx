import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { render, screen } from 'tests/utils'

import { MarketingBlock } from './MarketingBlock'

const props = {
  accessibilityLabel: 'Accessibility label',
  title: 'Harry Potter et l’Ordre du Phénix',
  categoryId: CategoryIdEnum.FILM,
  categoryText: 'Cinéma',
  navigateTo: { screen: 'Venue' as const },
  backgroundImageUrl: 'url',
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
