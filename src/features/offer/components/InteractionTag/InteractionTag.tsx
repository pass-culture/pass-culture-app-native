import React, { ReactNode } from 'react'
import { DefaultTheme } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { isBookClubSubcategory } from 'features/clubAdvices/helpers/isBookClubSubcategory'
import { formatLikesCounter } from 'features/offer/helpers/formatLikesCounter/formatLikesCounter'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagProps, TagVariant } from 'ui/designSystem/Tag/types'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'

type InteractionTagParams = {
  theme: DefaultTheme
  subcategoryId: SubcategoryIdEnum
  likesCount?: number
  advicesCount?: number
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
  advicesCount = 0,
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

  if (advicesCount > 0) {
    if (isBookClubSubcategory(subcategoryId)) {
      return {
        label: hasSmallLayout ? `${advicesCount} avis` : `${advicesCount} avis book club`,
        variant: TagVariant.BOOKCLUB,
      }
    }
    return {
      label: hasSmallLayout ? `${advicesCount} avis` : `${advicesCount} avis ciné club`,
      variant: TagVariant.CINECLUB,
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
