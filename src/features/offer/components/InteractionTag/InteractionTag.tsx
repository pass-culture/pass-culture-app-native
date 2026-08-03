import React, { ReactNode } from 'react'
import { DefaultTheme } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { isBookClubSubcategory } from 'features/clubAdvices/helpers/isBookClubSubcategory'
import { isCineClubSubcategory } from 'features/clubAdvices/helpers/isCineClubSubcategory'
import { isSceneClubSubcategory } from 'features/clubAdvices/helpers/isSceneClubSubcategory'
import { formatLikesCounter } from 'features/offer/helpers/formatLikesCounter/formatLikesCounter'
import { ClubAdviceType } from 'libs/analytics/types'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagProps, TagVariant } from 'ui/designSystem/Tag/types'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'

type InteractionTagParams = {
  theme: DefaultTheme
  subcategoryId: SubcategoryIdEnum
  likesCount?: number
  clubAdvicesCount?: number
  proAdvicesCount?: number
  hasSmallLayout?: boolean
  isComingSoonOffer?: boolean
  enableSceneClubTag?: boolean
}

type ClubTagConfig = {
  isClubSubcategory: (subcategoryId: SubcategoryIdEnum) => boolean
  adviceType: ClubAdviceType
  wording: string
  variant: TagVariant
  isBehindSceneClubFlag?: boolean
}

const CLUB_TAGS: ClubTagConfig[] = [
  {
    isClubSubcategory: isBookClubSubcategory,
    adviceType: 'book_club',
    wording: 'book club',
    variant: TagVariant.BOOKCLUB,
  },
  {
    isClubSubcategory: isCineClubSubcategory,
    adviceType: 'cine_club',
    wording: 'ciné club',
    variant: TagVariant.CINECLUB,
  },
  {
    isClubSubcategory: isSceneClubSubcategory,
    adviceType: 'scene_club',
    wording: 'scène club',
    variant: TagVariant.SCENECLUB,
    isBehindSceneClubFlag: true,
  },
]

const findClubTag = ({
  clubAdvicesCount = 0,
  subcategoryId,
  enableSceneClubTag,
}: InteractionTagParams): ClubTagConfig | undefined => {
  if (clubAdvicesCount === 0) return undefined

  return CLUB_TAGS.find(
    ({ isClubSubcategory, isBehindSceneClubFlag }) =>
      isClubSubcategory(subcategoryId) && (!isBehindSceneClubFlag || enableSceneClubTag)
  )
}

export const renderInteractionTag = (params: InteractionTagParams): ReactNode | undefined => {
  const tagProps = getTagProps(params)
  if (!tagProps) return undefined

  return <Tag testID="interaction-tag" {...tagProps} />
}

const getClubTagProps = (params: InteractionTagParams): TagProps | null => {
  const { clubAdvicesCount = 0, hasSmallLayout } = params

  const club = findClubTag(params)
  if (!club) return null

  return {
    label: hasSmallLayout ? `${clubAdvicesCount} avis` : `${clubAdvicesCount} avis ${club.wording}`,
    variant: club.variant,
  }
}

export const getDisplayedClubAdviceType = (
  params: InteractionTagParams
): ClubAdviceType | undefined => {
  if (params.isComingSoonOffer) return undefined

  return findClubTag(params)?.adviceType
}

export const getTagProps = (params: InteractionTagParams): TagProps | null => {
  const { likesCount = 0, proAdvicesCount = 0, hasSmallLayout, isComingSoonOffer } = params

  if (isComingSoonOffer) {
    return {
      label: hasSmallLayout ? 'Bientôt' : 'Bientôt dispo',
      variant: TagVariant.WARNING,
      Icon: ClockFilled,
    }
  }

  const clubTagProps = getClubTagProps(params)
  if (clubTagProps) return clubTagProps

  if (proAdvicesCount > 0) {
    return {
      label: hasSmallLayout ? `${proAdvicesCount} avis` : `${proAdvicesCount} avis des pros`,
      variant: TagVariant.PROEDITO,
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
