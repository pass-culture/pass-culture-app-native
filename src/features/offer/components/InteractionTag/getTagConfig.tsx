import styled from 'styled-components/native'

import { InteractionTagProps } from 'features/offer/components/InteractionTag/InteractionTag'
import { theme } from 'theme'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

type TagConfig = {
  theme: typeof theme
  likesCount?: number
  chroniclesCount?: number
  headlineCount?: number
}

// TODO(PC-35427) handle logic values with remote config
const MIN_LIKES_VALUE = 20
const MAX_LIKES_VALUE = 50

export function getTagConfig({
  theme,
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
    return likesCount && likesCount >= MIN_LIKES_VALUE ? likesTagConfig : headlineTagConfig
  }

  if (hasHeadline && hasChronicles) {
    return likesCount && likesCount >= MAX_LIKES_VALUE ? likesTagConfig : bookClubTagConfig
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
