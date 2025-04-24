import React from 'react'
import { useTheme } from 'styled-components/native'

import { MarketingBlockContent } from 'features/home/components/modules/marketing/MarketingBlockContent'
import { MarketingBlockContentDesktop } from 'features/home/components/modules/marketing/MarketingBlockContentDesktop'
import { MarketingBlockProps } from 'features/home/components/modules/marketing/types'

const GRADIENT_HEIGHT = '100%'

export const MarketingBlock = (props: MarketingBlockProps) => {
  const { isDesktopViewport } = useTheme()

  if (isDesktopViewport) {
    return <MarketingBlockContentDesktop {...props} gradientHeight={GRADIENT_HEIGHT} />
  }
  return <MarketingBlockContent {...props} gradientHeight={GRADIENT_HEIGHT} />
}
