import React, { FunctionComponent, useMemo } from 'react'
import { Platform } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ArtistResponse } from 'api/gen'
import { ArtistHeader } from 'features/artist/components/ArtistHeader/ArtistHeader'
import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { ArtistTopOffers } from 'features/artist/components/ArtistTopOffers/ArtistTopOffers'
import { ArtistWebMetaHeader } from 'features/artist/components/ArtistWebMetaHeader'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'
import { ensureEndingDot } from 'libs/parsers/ensureEndingDot'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'

const NUMBER_OF_LINES_OF_DESCRIPTION_SECTION = 5

type Props = {
  artist: ArtistResponse
  artistPlaylist: AlgoliaOfferWithArtistAndEan[]
  artistTopOffers: AlgoliaOfferWithArtistAndEan[]
}

export const ArtistBody: FunctionComponent<Props> = ({
  artist,
  artistPlaylist,
  artistTopOffers,
}) => {
  const { goBack } = useGoBack('Offer')
  const { appBarHeight } = useTheme()
  const { headerTransition, onScroll } = useOpacityTransition()

  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const { name, description, image } = artist

  const avatarImage = useMemo(() => {
    if (!image) {
      return undefined
    }
    return (
      <StyledImage
        url={image}
        accessibilityRole={AccessibilityRole.IMAGE}
        accessibilityLabel="artist avatar"
      />
    )
  }, [image])

  const descriptionWithDot = ensureEndingDot(description ?? '')
  const capitalizedDescriptionWithDot = capitalizeFirstLetter(descriptionWithDot)

  return (
    <Page>
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
            <ArtistHeader name={name} avatarImage={avatarImage} />
            {capitalizedDescriptionWithDot ? (
              <Description gap={1}>
                <Typo.BodyAccent>Quelques infos à son sujet</Typo.BodyAccent>
                <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
                  {highlightLinks(capitalizedDescriptionWithDot)}
                </CollapsibleText>
              </Description>
            ) : null}
          </ViewGap>
          <ArtistTopOffers artistName={name} items={artistTopOffers} />
          <ArtistPlaylist artistName={name} items={artistPlaylist} />
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
    </Page>
  )
}

const ContentContainer = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})

const Description = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
