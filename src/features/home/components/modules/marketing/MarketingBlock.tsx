import React from 'react'
import { useTheme } from 'styled-components/native'

import { MarketingBlockContent } from 'features/home/components/modules/marketing/MarketingBlockContent'
import { MarketingBlockContentDesktop } from 'features/home/components/modules/marketing/MarketingBlockContentDesktop'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type MarketingBlockProps = {
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
  accessibilityLabel?: string
  backgroundImageUrl?: string
  AttachedCardComponent: React.ReactNode
  comingSoon?: string
}

export const MarketingBlock = (props: MarketingBlockProps) => {
  const { isDesktopViewport } = useTheme()

  if (isDesktopViewport) {
    return <MarketingBlockContentDesktop {...props} />
  }
  return <MarketingBlockContent {...props} />
}
