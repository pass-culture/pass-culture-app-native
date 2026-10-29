import React, { ComponentProps, FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { AvatarProps } from 'ui/components/Avatar/Avatar'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { HorizontalArtistsPlaylistSkeleton } from 'ui/components/HorizontalArtistsPlaylistSkeleton'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type AvatarItem = ComponentProps<typeof AvatarList>['data'][number]
type SeeAllData = ComponentProps<typeof SeeAllButton>['data']

export type HorizontalArtistsPlaylistProps = {
  title: string
  artists: AvatarItem[]
  isLoading?: boolean
  onItemPress: (id: string, name: string) => void
  seeAllData?: SeeAllData
  itemConfig?: AvatarProps
}

export const HorizontalArtistsPlaylist: FunctionComponent<HorizontalArtistsPlaylistProps> = ({
  title,
  artists,
  isLoading,
  onItemPress,
  seeAllData,
  itemConfig,
}) => {
  if (isLoading) return <HorizontalArtistsPlaylistSkeleton title={title} />
  if (artists.length === 0) return null

  const showSeeAll = !!(seeAllData && artists.length > 1)

  return (
    <View>
      <HeaderContainer>
        <TitleRow gap={3}>
          <AccessibleTitle title={title} TitleComponent={TitleLevel2} withMargin={false} />

          {showSeeAll ? (
            <View>
              <SeeAllButton playlistTitle={title} data={seeAllData} />
            </View>
          ) : null}
        </TitleRow>
      </HeaderContainer>

      <AvatarList
        data={artists}
        avatarConfig={itemConfig}
        onItemPress={onItemPress}
        withMargins
        withPush
      />
    </View>
  )
}

const TitleLevel2 = styled(Typo.Title3).attrs(setTextSemantic('h2'))``

const HeaderContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: theme.designSystem.size.spacing.m,
}))

const TitleRow = styled(ViewGap)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'baseline',
})
