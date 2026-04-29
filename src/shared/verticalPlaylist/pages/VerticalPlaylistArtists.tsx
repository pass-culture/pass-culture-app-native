import { useRoute } from '@react-navigation/native'
import React from 'react'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { NumberOfItems } from 'shared/NumberOfItems/NumberOfItems'
import { HorizontalArtistTile } from 'shared/verticalPlaylist/components/HorizontalArtistTile'
import { LineSeparator } from 'shared/verticalPlaylist/components/LineSeparator'
import { useGetArtistsFromPlaylist } from 'shared/verticalPlaylist/helpers/useGetArtistsFromPlaylist'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Page } from 'ui/pages/Page'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const VerticalPlaylistArtists = () => {
  const headerHeight = useGetHeaderHeight()
  const { contentPage } = useTheme()
  const { params } = useRoute<UseRouteType<'VerticalPlaylistArtists'>>()
  const { title, subtitle, items, nbItems } = useGetArtistsFromPlaylist({ params })
  const renderItem = ({ item }) => <HorizontalArtistTile artist={item} />

  return (
    <Page>
      <PageHeaderWithoutPlaceholder />
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
      />
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
