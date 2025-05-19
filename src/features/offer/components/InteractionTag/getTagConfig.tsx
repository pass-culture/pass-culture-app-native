import styled from 'styled-components/native'

import { InteractionTagProps } from 'features/offer/components/InteractionTag/InteractionTag'
import { theme } from 'theme'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

type TagConfig = {
  theme: typeof theme
  likesCount?: number
  chroniclesCount?: number
  headlinesCount?: number
  hasSmallLayout?: boolean
  isComingSoonOffer?: boolean
}

export function getTagConfig({
  theme,
  likesCount = 0,
  chroniclesCount = 0,
  headlinesCount = 0,
  hasSmallLayout,
  isComingSoonOffer,
}: TagConfig): InteractionTagProps | null {
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
