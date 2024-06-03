import React from 'react'
import { useTheme } from 'styled-components/native'

import { AttachedOfferCardProps } from 'features/home/components/AttachedOfferCard'
import { MarketingBlockContent } from 'features/home/components/modules/marketing/MarketingBlockContent'
import { MarketingBlockContentDesktop } from 'features/home/components/modules/marketing/MarketingBlockContentDesktop'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

type MarketingBlockProps = Omit<AttachedOfferCardProps, 'onPress'> & {
  accessibilityLabel: string
  navigateTo: InternalNavigationProps['navigateTo']
  backgroundImageUrl?: string
  onBeforeNavigate?: () => void
}

export const MarketingBlock = (props: MarketingBlockProps) => {
  const { isDesktopViewport } = useTheme()

  if (isDesktopViewport) {
    return <MarketingBlockContentDesktop {...props} />
  }
  return <MarketingBlockContent {...props} />
}
