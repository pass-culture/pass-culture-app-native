import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'
import { IconWithCaption } from 'ui/components/IconWithCaption'

interface OfferCategoryProps {
  categoryId: CategoryIdEnum | null
  label: string
}

export const OfferCategory = ({ categoryId, label }: OfferCategoryProps) => {
  const Icon = mapCategoryToIcon(categoryId)
  return <IconWithCaption Icon={Icon} caption={label} accessibilityLabel="Catégorie de l’offre" />
}
