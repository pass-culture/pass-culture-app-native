import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { Artist } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { NumberOfItems } from 'shared/NumberOfItems/NumberOfItems'
import { HorizontalArtistTile } from 'shared/verticalPlaylist/components/HorizontalArtistTile'
import { LineSeparator } from 'shared/verticalPlaylist/components/LineSeparator'
import { useGetArtistsFromPlaylist } from 'shared/verticalPlaylist/helpers/useGetArtistsFromPlaylist'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { Page } from 'ui/pages/Page'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const VerticalPlaylistArtists = () => {
  const headerHeight = useGetHeaderHeight()
  const { contentPage } = useTheme()
  const { params } = useRoute<UseRouteType<'VerticalPlaylistArtists'>>()
  const { goBack } = useNavigation<UseNavigationType>()
  const { headerTransition, onScroll } = useOpacityTransition()
  const { title, subtitle, items, nbItems } = useGetArtistsFromPlaylist({ params })
  const renderItem = ({ item }) => (
    <HorizontalArtistTile artist={item} onBeforeNavigate={handlePressArtistTile} />
  )

  const handlePressArtistTile = (artist: Artist) => {
    void analytics.logConsultArtist({
      artistId: artist.id,
      artistName: artist.name,
      from: 'verticalplaylistartists',
      originDetails: params.originDetails,
    })
  }

  return (
    <Page>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={LineSeparator}
        ListHeaderComponent={
          <React.Fragment>
            <Placeholder height={headerHeight} />
            <Typo.Title2 {...getHeadingAttrs(1)}>{title}</Typo.Title2>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
            <TitleContainer>
              <NumberOfItems nbItems={nbItems} type="artists" />
            </TitleContainer>
          </React.Fragment>
        }
        ListFooterComponent={<Spacer.BottomScreen />}
        contentContainerStyle={{
          paddingHorizontal: contentPage.marginHorizontal,
          paddingVertical: contentPage.marginVertical,
        }}
        onScroll={onScroll}
      />
      {/* On native header is called after Body to implement the BlurView for iOS */}
      <ContentHeader headerTitle={title} onBackPress={goBack} headerTransition={headerTransition} />
    </Page>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const TitleContainer = styled.View({
  justifyContent: 'center',
})

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
  color: theme.designSystem.color.text.subtle,
}))
