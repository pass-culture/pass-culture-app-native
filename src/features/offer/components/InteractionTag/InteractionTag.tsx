import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { ColorsTypeLegacy } from 'theme/types'
import { Tag } from 'ui/components/Tag/Tag'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Star } from 'ui/svg/Star'
import { getSpacing } from 'ui/theme'

type InteractionTagParams = {
  theme: typeof theme
  likesCount?: number
  chroniclesCount?: number
  headlinesCount?: number
  hasSmallLayout?: boolean
  isComingSoonOffer?: boolean
}

type TagProps = {
  label: string
  backgroundColor?: ColorsTypeLegacy
  Icon?: React.FunctionComponent<AccessibleIcon>
}

export const renderInteractionTag = (params: InteractionTagParams): ReactElement | undefined => {
  const tagProps = getTagProps(params)
  if (!tagProps) return undefined

  return <Tag testID="interaction-tag" paddingHorizontal={getSpacing(1)} {...tagProps} />
}

export const getTagProps = ({
  theme,
  likesCount = 0,
  chroniclesCount = 0,
  headlinesCount = 0,
  hasSmallLayout,
  isComingSoonOffer,
}: InteractionTagParams): TagProps | null => {
  if (isComingSoonOffer)
    return {
      label: hasSmallLayout ? 'Bientôt' : 'Bientôt dispo',
      backgroundColor: theme.designSystem.color.background.warning,
      Icon: CustomWait,
    }

  if (chroniclesCount > 0)
    return {
      label: hasSmallLayout ? 'Reco Club' : 'Reco du Club',
      backgroundColor: theme.colors.skyBlueLight,
      Icon: CustomBookClub,
    }

  if (headlinesCount > 0)
    return {
      label: hasSmallLayout ? 'Reco lieux' : 'Reco par les lieux',
      backgroundColor: theme.colors.goldLight100,
      Icon: CustomStar,
    }

  if (likesCount > 0)
    return {
      label: `${likesCount} j’aime`,
      backgroundColor: theme.colors.greyLight,
      Icon: CustomThumbUp,
    }

  return null
}

const CustomThumbUp = styled(ThumbUpFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.primary,
}))``

const CustomBookClub = styled(BookClubCertification).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const CustomStar = styled(Star).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const CustomWait = styled(ClockFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.warning,
  size: theme.icons.sizes.extraSmall,
}))``
