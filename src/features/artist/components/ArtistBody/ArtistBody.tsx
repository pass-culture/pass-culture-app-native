import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { ArtistHeader } from 'features/artist/components/ArtistHeader/ArtistHeader'
import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { ArtistWebMetaHeader } from 'features/artist/components/ArtistWebMetaHeader'
import { Artist } from 'features/artist/pages/Artist'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { Subcategory } from 'libs/subcategories/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'

const NUMBER_OF_LINES_OF_DESCRIPTION_SECTION = 5

type Props = {
  offer: OfferResponseV2
  artist: Artist
  subcategory: Subcategory
}

export const ArtistBody: FunctionComponent<Props> = ({ offer, artist, subcategory }) => {
  const { params } = useRoute<UseRouteType<'Artist'>>()
  const { goBack } = useGoBack('Offer', { id: params.fromOfferId })
  const { appBarHeight } = useTheme()
  const { headerTransition, onScroll } = useOpacityTransition()

  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const { name, bio } = artist

  return (
    <Container>
      <ArtistWebMetaHeader artist={name} />
      {/* On web header is called before Body for accessibility navigate order */}
      {isWeb ? (
        <ContentHeader
          headerTitle={name}
          onBackPress={goBack}
          headerTransition={headerTransition}
        />
      ) : null}

      <ContentContainer
        scrollEventThrottle={16}
        bounces={false}
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: headerHeight }}>
        <ViewGap gap={8}>
          <ViewGap gap={6}>
            <ArtistHeader name={name} />
            {bio ? (
              <Description gap={1}>
                <Typo.ButtonText>Quelques infos à son sujet</Typo.ButtonText>
                <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
                  {bio}
                </CollapsibleText>
              </Description>
            ) : null}
          </ViewGap>
          <ArtistPlaylist offer={offer} subcategory={subcategory} artistName={name} />
        </ViewGap>
      </ContentContainer>

      {/* On native header is called after Body to implement the BlurView for iOS */}
      {isWeb ? null : (
        <ContentHeader
          headerTitle={name}
          onBackPress={goBack}
          headerTransition={headerTransition}
        />
      )}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const ContentContainer = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})

const Description = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
