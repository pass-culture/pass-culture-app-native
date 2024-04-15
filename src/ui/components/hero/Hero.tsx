import React, { FunctionComponent } from 'react'

import { CategoryIdEnum } from 'api/gen'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { HeroBody } from 'ui/components/hero/HeroBody'
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
    <HeaderWithImage imageHeight={heroBackgroundHeight} imageUrl={imageUrl} onPress={onPress}>
      <Spacer.Column numberOfSpaces={heroMarginTop} />
      <HeroBody
        categoryId={categoryId}
        imageUrl={imageUrl}
        shouldDisplayOfferPreview={shouldDisplayOfferPreview}
      />
    </HeaderWithImage>
  )
}
