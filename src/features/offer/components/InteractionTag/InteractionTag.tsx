import React, { ReactElement } from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { isBookClubSubcategory } from 'features/chronicle/helpers/isBookClubSubcategory'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { Tag } from 'ui/components/Tag/Tag'
import { TagVariant } from 'ui/components/Tag/types'

type InteractionTagParams = {
  theme: typeof theme
  subcategoryId: SubcategoryIdEnum
  likesCount?: number
  chroniclesCount?: number
  headlinesCount?: number
  hasSmallLayout?: boolean
  isComingSoonOffer?: boolean
}

type TagProps = {
  label: string
  variant: TagVariant
}

export const renderInteractionTag = (params: InteractionTagParams): ReactElement | undefined => {
  const tagProps = getTagProps(params)
  if (!tagProps) return undefined

  return <Tag testID="interaction-tag" {...tagProps} />
}

export const getTagProps = ({
  likesCount = 0,
  chroniclesCount = 0,
  headlinesCount = 0,
  hasSmallLayout,
  isComingSoonOffer,
  subcategoryId,
}: InteractionTagParams): TagProps | null => {
  if (isComingSoonOffer) {
    return {
      label: hasSmallLayout ? 'Bientôt' : 'Bientôt dispo',
      variant: TagVariant.WARNING,
    }
  }

  if (chroniclesCount > 0) {
    if (isBookClubSubcategory(subcategoryId)) {
      return {
        label: hasSmallLayout ? 'Reco Club' : 'Reco du Book Club',
        variant: TagVariant.BOOKCLUB,
      }
    }
    return {
      label: hasSmallLayout ? 'Reco Club' : 'Reco du Ciné Club',
      variant: TagVariant.CINECLUB,
    }
  }

  if (headlinesCount > 0) {
    return {
      label: hasSmallLayout ? 'Reco lieux' : 'Reco par les lieux',
      variant: TagVariant.HEADLINE,
    }
  }

  if (likesCount > 0) {
    return {
      label: `${likesCount} j’aime`,
      variant: TagVariant.LIKE,
    }
  }

  return null
}
