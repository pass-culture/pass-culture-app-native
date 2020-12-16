import React from 'react'

import { CategoryNameEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'

import { IconWithCaption } from './IconWithCaption'

interface OfferCategoryProps {
  category: CategoryNameEnum | null
  label?: string
}

export const OfferCategory = ({ category, label }: OfferCategoryProps) => {
  const Icon = mapCategoryToIcon(category)
  return <IconWithCaption Icon={Icon} caption={label || ''} />
}
