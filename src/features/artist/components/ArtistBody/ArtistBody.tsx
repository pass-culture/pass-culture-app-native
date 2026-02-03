import React, { FunctionComponent } from 'react'
import { Platform, ViewToken } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ArtistResponse } from 'api/gen'
import { ArtistHeader } from 'features/artist/components/ArtistHeader/ArtistHeader'
import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { ArtistTopOffers } from 'features/artist/components/ArtistTopOffers/ArtistTopOffers'
import { ArtistWebMetaHeader } from 'features/artist/components/ArtistWebMetaHeader'
import { useGoBack } from 'features/navigation/useGoBack'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { capitalize } from 'libs/formatter/capitalize'
import { ensureEndingDot } from 'libs/parsers/ensureEndingDot'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'

type Props = {
  artist: ArtistResponse
  artistPlaylist: AlgoliaOfferWithArtistAndEan[]
  artistTopOffers: AlgoliaOfferWithArtistAndEan[]
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    artistId: string,
    playlistIndex?: number
  ) => void
  onExpandBioPress: () => void
}

export const ArtistBody: FunctionComponent<Props> = ({
  artist,
  artistPlaylist,
  artistTopOffers,
  onViewableItemsChanged,
  onExpandBioPress,
}) => {
  const { goBack } = useGoBack('Offer')
  const { appBarHeight } = useTheme()
  const { headerTransition, onScroll } = useOpacityTransition()

  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const { name, description, image } = artist

  const descriptionWithDot = ensureEndingDot(description ?? '')
  const capitalizedDescriptionWithDot = capitalize(descriptionWithDot)

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
            <ArtistHeader name={name} avatarImage={image} />
            {capitalizedDescriptionWithDot ? (
              <Description gap={1}>
                <Typo.BodyAccent>À propos</Typo.BodyAccent>
                <CollapsibleText
                  text={capitalizedDescriptionWithDot}
                  onAdditionalPress={onExpandBioPress}>
                  {artist.descriptionSource ? (
                    <ViewGap gap={1}>
                      <Credit>{artist.descriptionCredit}</Credit>
                      {isWeb ? (
                        <ExternalTouchableLink
                          as={ButtonQuaternaryBlack}
                          wording="Source&nbsp;: Wikipédia"
                          externalNav={{ url: artist.descriptionSource }}
                          justifyContent="flex-start"
                          inline
                          icon={ExternalSiteFilled}
                        />
                      ) : (
                        <InternalTouchableLink
                          as={ButtonQuaternaryBlack}
                          wording="Source&nbsp;: Wikipédia"
                          navigateTo={{ screen: 'ArtistWebview', params: { id: artist.id } }}
                          justifyContent="flex-start"
                          inline
                          icon={ExternalSiteFilled}
                        />
                      )}
                    </ViewGap>
                  ) : null}
                </CollapsibleText>
              </Description>
            ) : null}
          </ViewGap>
          <ArtistTopOffers artistName={name} items={artistTopOffers} />
          <ArtistPlaylist
            artist={artist}
            items={artistPlaylist}
            onViewableItemsChanged={onViewableItemsChanged}
          />
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

const Credit = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.m,
  color: theme.designSystem.color.text.subtle,
}))
