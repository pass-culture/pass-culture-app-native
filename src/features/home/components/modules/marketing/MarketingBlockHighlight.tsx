import React, { memo } from 'react'

import { AttachedThematicCard } from 'features/home/components/AttachedModuleCard/AttachedThematicCard'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'

export type MarketingBlockHighlightProps = {
  title: string
  label?: string
  homeId: string
  moduleId: string
  backgroundImageUrl?: string
  subtitle?: string
}

const UnmemoizedMarketingBlockHighlight = ({
  title,
  label,
  homeId,
  moduleId,
  backgroundImageUrl,
  subtitle,
}: MarketingBlockHighlightProps) => {
  const accessibilityLabel = `Découvre le temps fort "${title}" ${dateRange}.`

  return (
    <MarketingBlock
      navigateTo={{
        screen: 'ThematicHome',
        params: { homeId, from: 'highlight_thematic_block', moduleId },
      }}
      backgroundImageUrl={backgroundImageUrl}
      accessibilityLabel={accessibilityLabel}
      AttachedCardComponent={
        <AttachedThematicCard title={title} subtitle={subtitle} label={label} />
      }
    />
  )
}

// Old version: ThematicHighlightModule.tsx
export const MarketingBlockHighlight = memo(UnmemoizedMarketingBlockHighlight)
