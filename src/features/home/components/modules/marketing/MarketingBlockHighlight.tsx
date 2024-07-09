import React, { memo } from 'react'
import styled from 'styled-components/native'

import { AttachedThematicCard } from 'features/home/components/AttachedModuleCard/AttachedThematicCard'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'
import { getShadow, getSpacing } from 'ui/theme'

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
  return (
    <MarketingBlock
      navigateTo={{
        screen: 'ThematicHome',
        params: { homeId, from: 'highlight_thematic_block', moduleId },
      }}
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

const ShadowWrapper = styled.View(({ theme }) => ({
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(3),
    },
    shadowRadius: getSpacing(12),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))
