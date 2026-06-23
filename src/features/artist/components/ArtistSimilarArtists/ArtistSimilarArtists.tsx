import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ArtistSimilarArtistsSkeleton } from 'features/artist/components/ArtistSimilarArtists/ArtistSimilarArtistsSkeleton'
import { useSimilarArtistsQuery } from 'features/artist/queries/useSimilarArtistsQuery'
import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  artistId: string
}

const TITLE = 'Tu peux aussi aimer'

export const ArtistSimilarArtists: FunctionComponent<Props> = ({ artistId }) => {
  const isSimilarArtistsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_SIMILAR_ARTISTS)
  const { data: artists = [], isLoading } = useSimilarArtistsQuery(artistId, {
    enabled: isSimilarArtistsEnabled,
  })

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({ type: 'artists', moduleName: TITLE, from: 'artist' })
  }

  const handleItemPress = (id: string, name: string) => {
    void analytics.logConsultArtist({ artistId: id, artistName: name, from: 'artist' })
  }

  if (!isSimilarArtistsEnabled) return null
  if (isLoading) return <ArtistSimilarArtistsSkeleton title={TITLE} />
  if (artists.length === 0) return null

  return (
    <View>
      <HeaderContainer>
        <TitleRow gap={3}>
          <TitleContainer>
            <AccessibleTitle title={TITLE} TitleComponent={TitleLevel2} withMargin={false} />
          </TitleContainer>
          {artists.length > 1 ? (
            <SeeAllButton
              playlistTitle={TITLE}
              data={{
                onBeforeNavigate,
                navigateToVerticalPlaylist: {
                  screen: 'VerticalPlaylistArtists',
                  params: { title: TITLE, subtitle: undefined, similarToArtistId: artistId },
                },
                hideSearchSeeAll: true,
              }}
            />
          ) : null}
        </TitleRow>
      </HeaderContainer>
      <AvatarList
        data={artists}
        avatarConfig={{ size: AVATAR_MEDIUM, rounded: true }}
        onItemPress={handleItemPress}
        withMargins
        withPush
      />
    </View>
  )
}

const TitleLevel2 = styled(Typo.Title3).attrs(getHeadingAttrs(2))``

const HeaderContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: theme.designSystem.size.spacing.m,
}))

const TitleContainer = styled.View({
  flex: 1,
})

const TitleRow = styled(ViewGap)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})
