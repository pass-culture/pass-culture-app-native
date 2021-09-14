import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'

import { IconWithCaption } from './IconWithCaption'

interface OfferCategoryProps {
  category: CategoryIdEnum | null
  label?: string
}

export const OfferCategory = ({ category, label }: OfferCategoryProps) => {
  const Icon = mapCategoryToIcon(category)
  return <IconWithCaption Icon={Icon} caption={label || ''} />
}
