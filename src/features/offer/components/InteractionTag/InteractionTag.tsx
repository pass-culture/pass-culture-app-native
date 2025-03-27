import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Tag } from 'ui/components/Tag/Tag'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

type Props = {
  likesCount?: number
  chroniclesCount?: number
  headlineCount?: number
}

export const InteractionTag: FunctionComponent<Props> = ({
  likesCount,
  chroniclesCount,
  headlineCount,
}) => {
  const { colors } = useTheme()

  const getTagConfig = (likesCount?: number, chroniclesCount?: number, headlineCount?: number) => {
    const headlineTagConfig = {
      label: 'Reco par les lieux',
      backgroundColor: colors.goldLight100,
      Icon: CustomStar,
    }
    const likesTagConfig = {
      label: likesCount ? `${likesCount} j’aime` : '',
      backgroundColor: colors.white,
      Icon: CustomThumbUp,
    }
    const bookClubTagConfig = {
      label: 'Reco du Book Club',
      backgroundColor: colors.skyBlueLight,
      Icon: CustomBookClub,
    }

    const hasHeadline = !!headlineCount
    const hasChronicles = !!chroniclesCount
    const hasLikes = !!likesCount

    if (hasHeadline && !hasChronicles) {
      return likesCount && likesCount >= 20 ? likesTagConfig : headlineTagConfig
    }

    if (hasHeadline && hasChronicles) {
      return likesCount && likesCount >= 50 ? likesTagConfig : bookClubTagConfig
    }

    if (hasLikes) return likesTagConfig
    if (hasChronicles) return bookClubTagConfig
    if (hasHeadline) return headlineTagConfig

    return null
  }

  const tagConfig = getTagConfig(likesCount, chroniclesCount, headlineCount)

  if (!tagConfig) return null

  return (
    <Tag
      label={tagConfig.label}
      backgroundColor={tagConfig.backgroundColor}
      Icon={tagConfig.Icon}
    />
  )
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
