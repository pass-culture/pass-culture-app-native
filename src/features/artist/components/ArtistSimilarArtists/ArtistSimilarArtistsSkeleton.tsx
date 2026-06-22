import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { Typo } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const NUMBER_OF_AVATARS = 10
const AVATAR_SKELETON_KEYS = Array.from(
  { length: NUMBER_OF_AVATARS },
  (_, index) => `artist-skeleton-${index}`
)

type Props = {
  title: string
}

export const ArtistSimilarArtistsSkeleton: FunctionComponent<Props> = ({ title }) => {
  const { designSystem } = useTheme()

  return (
    <View testID="ArtistSimilarArtistsSkeleton">
      <HeaderContainer>
        <AccessibleTitle title={title} TitleComponent={TitleLevel2} withMargin={false} />
      </HeaderContainer>
      <AvatarsRow>
        {AVATAR_SKELETON_KEYS.map((key) => (
          <AvatarPlaceholder key={key}>
            <SkeletonTile
              width={AVATAR_MEDIUM}
              height={AVATAR_MEDIUM}
              borderRadius={AVATAR_MEDIUM / 2}
            />
            <NameContainer>
              <SkeletonTile
                width={AVATAR_MEDIUM * 0.7}
                height={designSystem.size.spacing.m}
                borderRadius={designSystem.size.borderRadius.m}
              />
            </NameContainer>
          </AvatarPlaceholder>
        ))}
      </AvatarsRow>
    </View>
  )
}

const TitleLevel2 = styled(Typo.Title3).attrs(getHeadingAttrs(2))``

const HeaderContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: theme.designSystem.size.spacing.m,
}))

const AvatarsRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginHorizontal: theme.contentPage.marginHorizontal,
  gap: theme.designSystem.size.spacing.l,
}))

const AvatarPlaceholder = styled.View(({ theme }) => ({
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.s,
}))

// Reserve roughly one text line so the layout does not shift on load.
const NameContainer = styled.View(({ theme }) => ({
  width: AVATAR_MEDIUM,
  height: theme.designSystem.size.spacing.xl,
  alignItems: 'center',
  justifyContent: 'center',
}))
