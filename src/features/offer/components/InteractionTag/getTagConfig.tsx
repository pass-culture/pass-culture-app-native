import styled from 'styled-components/native'

import { InteractionTagProps } from 'features/offer/components/InteractionTag/InteractionTag'
import { theme } from 'theme'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

type TagConfig = {
  theme: typeof theme
  maxLikesValue: number
  minLikesValue: number
  likesCount?: number
  chroniclesCount?: number
  headlineCount?: number
}

export function getTagConfig({
  theme,
  maxLikesValue,
  minLikesValue,
  likesCount,
  chroniclesCount,
  headlineCount,
}: TagConfig): InteractionTagProps | null {
  const headlineTagConfig = {
    label: 'Reco par les lieux',
    backgroundColor: theme.colors.goldLight100,
    Icon: CustomStar,
  }
  const likesTagConfig = {
    label: likesCount ? `${likesCount} j’aime` : '',
    backgroundColor: theme.colors.white,
    Icon: CustomThumbUp,
  }
  const bookClubTagConfig = {
    label: 'Reco du Book Club',
    backgroundColor: theme.colors.skyBlueLight,
    Icon: CustomBookClub,
  }

  const hasHeadline = !!headlineCount
  const hasChronicles = !!chroniclesCount
  const hasLikes = !!likesCount

  if (hasHeadline && !hasChronicles) {
    return likesCount && likesCount >= minLikesValue ? likesTagConfig : headlineTagConfig
  }

  if (hasHeadline && hasChronicles) {
    return likesCount && likesCount >= maxLikesValue ? likesTagConfig : bookClubTagConfig
  }

  if (hasLikes) return likesTagConfig
  if (hasChronicles) return bookClubTagConfig
  if (hasHeadline) return headlineTagConfig

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
