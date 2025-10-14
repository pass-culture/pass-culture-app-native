import React, { ReactNode } from 'react'
import { DefaultTheme } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { isBookClubSubcategory } from 'features/chronicle/helpers/isBookClubSubcategory'
import { formatLikesCounter } from 'features/offer/helpers/formatLikesCounter/formatLikesCounter'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagProps, TagVariant } from 'ui/designSystem/Tag/types'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'

type InteractionTagParams = {
  theme: DefaultTheme
  subcategoryId: SubcategoryIdEnum
  likesCount?: number
  chroniclesCount?: number
  headlinesCount?: number
  hasSmallLayout?: boolean
  isComingSoonOffer?: boolean
}

export const renderInteractionTag = (params: InteractionTagParams): ReactNode | undefined => {
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
      Icon: ClockFilled,
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
      label: formatLikesCounter(likesCount),
      variant: TagVariant.LIKE,
    }
  }

  return null
}
