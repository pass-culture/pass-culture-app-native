import React from 'react'

import { AlgoliaCategory } from 'libs/algolia'
import { mapCategoryToIcon } from 'libs/parsers'

import { IconWithCaption } from './IconWithCaption'

interface OfferCategoryProps {
  category: AlgoliaCategory | null
  label?: string
}

export const OfferCategory = ({ category, label }: OfferCategoryProps) => {
  const Icon = mapCategoryToIcon(category)
  return <IconWithCaption Icon={Icon} caption={label || ''} />
}
