import React, { FunctionComponent } from 'react'

import { CategoryIdEnum } from 'api/gen'
import { HeroBody } from 'ui/components/hero/HeroBody'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { heroMarginTop, useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { Spacer } from 'ui/theme'

type HeroProps = {
  categoryId: CategoryIdEnum | null
  imageUrl?: string
  shouldDisplayOfferPreview?: boolean
  onPress?: VoidFunction
}

export const Hero: FunctionComponent<HeroProps> = ({
  categoryId,
  imageUrl,
  shouldDisplayOfferPreview,
  onPress,
}) => {
  const { heroBackgroundHeight } = useHeroDimensions()

  return (
    <HeroHeader imageHeight={heroBackgroundHeight} imageUrl={imageUrl} onPress={onPress}>
      <Spacer.Column numberOfSpaces={heroMarginTop} />
      <HeroBody
        categoryId={categoryId}
        imageUrl={imageUrl}
        shouldDisplayOfferPreview={shouldDisplayOfferPreview}
      />
    </HeroHeader>
  )
}
