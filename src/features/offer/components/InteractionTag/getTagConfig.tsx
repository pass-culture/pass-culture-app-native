import styled from 'styled-components/native'

import { InteractionTagProps } from 'features/offer/components/InteractionTag/InteractionTag'
import { theme } from 'theme'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

type TagConfig = {
  theme: typeof theme
  minLikesValue: number
  likesCount?: number
  chroniclesCount?: number
  headlineCount?: number
  hasSmallLayout?: boolean
}

export function getTagConfig({
  theme,
  minLikesValue,
  likesCount = 0,
  chroniclesCount = 0,
  headlineCount = 0,
  hasSmallLayout,
}: TagConfig): InteractionTagProps | null {
  const headlineTagConfig = {
    label: hasSmallLayout ? 'Reco lieux' : 'Reco par les lieux',
    backgroundColor: theme.colors.goldLight100,
    Icon: CustomStar,
  }
  const likesTagConfig = {
    label: likesCount ? `${likesCount} j’aime` : '',
    backgroundColor: theme.colors.greyLight,
    Icon: CustomThumbUp,
  }
  const bookClubTagConfig = {
    label: hasSmallLayout ? 'Reco Club' : 'Reco du Book Club',
    backgroundColor: theme.colors.skyBlueLight,
    Icon: CustomBookClub,
  }

  const hasLikes = likesCount > 0
  const hasChronicles = chroniclesCount > 0
  const hasHeadline = headlineCount > 0

  const hasLikesAboveThreshold = likesCount >= minLikesValue

  if (hasLikesAboveThreshold) return likesTagConfig

  if (hasHeadline && !hasChronicles && !hasLikesAboveThreshold) return headlineTagConfig

  if (hasHeadline && hasChronicles && !hasLikesAboveThreshold) return bookClubTagConfig

  if (hasHeadline && !hasChronicles && hasLikes && !hasLikesAboveThreshold) return headlineTagConfig

  if (!hasHeadline && hasChronicles) return bookClubTagConfig

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
