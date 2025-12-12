import React, { memo } from 'react'

import { AttachedThematicCard } from 'features/home/components/AttachedModuleCard/AttachedThematicCard'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { ShadowWrapper } from 'ui/components/ShadowWrapper'

export type MarketingBlockHighlightProps = {
  title: string
  label?: string
  homeId: string
  moduleId: string
  backgroundImageUrl?: string
  subtitle?: string
  onBeforeNavigate?: () => void
}

const UnmemoizedMarketingBlockHighlight = ({
  title,
  label,
  homeId,
  moduleId,
  backgroundImageUrl,
  subtitle,
  onBeforeNavigate,
}: MarketingBlockHighlightProps) => {
  return (
    <MarketingBlock
      accessibilityLabel={getComputedAccessibilityLabel(title, subtitle)}
      navigateTo={{
        screen: 'ThematicHome',
        params: { homeId, from: 'highlight_thematic_block', moduleId },
      }}
      onBeforeNavigate={onBeforeNavigate}
      backgroundImageUrl={backgroundImageUrl}
      AttachedCardComponent={
        <ShadowWrapper>
          <AttachedThematicCard title={title} subtitle={subtitle} label={label} />
        </ShadowWrapper>
      }
    />
  )
}

// Old version: ThematicHighlightModule.tsx
export const MarketingBlockHighlight = memo(UnmemoizedMarketingBlockHighlight)
