import React from 'react'

import { MarketingBlockProps } from 'features/home/components/modules/marketing/types'
import { render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

import { MarketingBlock } from './MarketingBlock'

const props: MarketingBlockProps = {
  accessibilityLabel: 'Accessibility label',
  navigateTo: { screen: 'Venue' as const },
  backgroundImageUrl: 'url',
  AttachedCardComponent: <Typo.Body>AttachedCardComponent</Typo.Body>,
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

  it('should display a darkened backgroundImage when blackGradient is true', async () => {
    render(<MarketingBlock {...props} withGradient />)

    expect(screen.getByTestId('black-gradient')).toBeOnTheScreen()
  })

  it('should not display a darkened backgroundImage when blackGradient is false', async () => {
    render(<MarketingBlock {...props} withGradient={false} />)

    expect(screen.queryByTestId('black-gradient')).not.toBeOnTheScreen()
  })
})
