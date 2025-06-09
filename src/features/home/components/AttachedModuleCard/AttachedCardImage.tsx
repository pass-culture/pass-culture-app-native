import React from 'react'

import { LeftImageComponentProps } from 'features/home/components/AttachedModuleCard/AttachedCardDisplay'
import { OfferImage } from 'ui/components/tiles/OfferImage'

export const AttachedCardImage = ({ imageUrl, categoryId }: LeftImageComponentProps) => (
  <OfferImage imageUrl={imageUrl} categoryId={categoryId} borderRadius={5} withStroke />
)
