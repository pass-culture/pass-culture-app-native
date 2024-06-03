import React, { memo } from 'react'

import { CategoryIdEnum } from 'api/gen'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'

type MarketingBlockHighlightProps = {
  title: string
  homeId: string
  moduleId: string
  backgroundImageUrl: string
  categoryText: string
  date: string
  categoryId: CategoryIdEnum
}

const UnmemoizedMarketingBlockHighlight = ({
  title,
  homeId,
  moduleId,
  backgroundImageUrl,
  categoryText,
  date,
  categoryId,
}: MarketingBlockHighlightProps) => {
  const accessibilityLabel = `Découvre le temps fort "${title}" de la catégorie "${categoryText}" ${date}.`

  return (
    <MarketingBlock
      accessibilityLabel={accessibilityLabel}
      categoryId={categoryId}
      navigateTo={{
        screen: 'ThematicHome',
        params: { homeId, from: 'highlight_thematic_block', moduleId },
      }}
      backgroundImageUrl={backgroundImageUrl}
      title={title}
      categoryText={categoryText}
      date={date}
      withRightArrow
      showImage={false}
    />
  )
}

// Old version: ThematicHighlightModule.tsx
export const MarketingBlockHighlight = memo(UnmemoizedMarketingBlockHighlight)
