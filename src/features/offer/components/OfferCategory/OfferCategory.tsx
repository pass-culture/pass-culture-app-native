import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { IconWithCaption } from 'features/offer/components/IconWithCaption'
import { mapCategoryToIcon } from 'libs/parsers'

interface OfferCategoryProps {
  categoryId: CategoryIdEnum | null
  label: string
}

export const OfferCategory = ({ categoryId, label }: OfferCategoryProps) => {
  const Icon = mapCategoryToIcon(categoryId)
  return <IconWithCaption Icon={Icon} caption={label} accessibilityLabel="Catégorie de l’offre" />
}
