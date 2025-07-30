import React from 'react'
import { useTheme } from 'styled-components/native'

import { LeftImageComponentProps } from 'features/home/components/AttachedModuleCard/AttachedCardDisplay'
import { OfferImage } from 'ui/components/tiles/OfferImage'

export const AttachedCardImage = ({ imageUrl, categoryId }: LeftImageComponentProps) => {
  const theme = useTheme()
  return (
    <OfferImage
      imageUrl={imageUrl}
      categoryId={categoryId}
      borderRadius={theme.designSystem.size.borderRadius.s}
      withStroke
    />
  )
}
