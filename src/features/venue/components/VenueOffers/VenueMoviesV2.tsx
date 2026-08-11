import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { InView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { MoviesScreeningCalendarV2 } from 'features/offer/components/MoviesScreeningCalendarV2/MoviesScreeningCalendarV2'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { VenueOffers } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { Offer } from 'shared/offer/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { Anchor } from 'ui/components/anchor/Anchor'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { LENGTH_M, RATIO_HOME_IMAGE, Typo } from 'ui/theme'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

const cinemaCTAButtonName = 'Accéder aux séances'
const playlistTitle = 'Les autres offres'

const keyExtractor = (item: Offer) => item.objectID

export const VenueMoviesV2: React.FC<{
  venueOffers: VenueOffers
  venueId: number
}> = ({ venueOffers, venueId }) => {
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()

  const { setButton, showButton } = useOfferCTA()
  const scrollToAnchor = useScrollToAnchor()
  useEffect(() => {
    setButton(cinemaCTAButtonName, () => {
      scrollToAnchor(AnchorNames.VENUE_CINE_AVAILABILITIES)
    })

    return () => {
      setButton('', () => null)
    }
  }, [scrollToAnchor, setButton])

  const nonMovieScreeningOffers = venueOffers?.hits.filter(
    (offer) => offer.offer.subcategoryId !== SubcategoryIdEnum.SEANCE_CINE
  )

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistOffers' as const,
    params: {
      type: VerticalPlaylist.VenueOffers,
      module: { venueId: venueId, playlistTitle },
    },
  }

  const onBeforeNavigate = () =>
    analytics.logClickSeeAll({
      type: 'offers',
      moduleName: playlistTitle,
      moduleId: nonMovieScreeningOffers?.[0]?.objectID,
      from: 'venue',
    })

  return (
    <Container>
      <Anchor name={AnchorNames.VENUE_CINE_AVAILABILITIES}>
        <InView
          onChange={(inView) => {
            showButton(!inView)
          }}>
          <StyledTitle3>Les films à l’affiche</StyledTitle3>
        </InView>
      </Anchor>
      <MoviesScreeningCalendarV2 venueId={venueId} />
      {nonMovieScreeningOffers.length ? (
        <SectionWithDivider visible margin={false} gap={6}>
          <PassPlaylistContainer>
            <PassPlaylist
              testID="offersModuleList"
              title={playlistTitle}
              data={nonMovieScreeningOffers}
              itemHeight={LENGTH_M}
              itemWidth={LENGTH_M * RATIO_HOME_IMAGE}
              withMargin={false}
              renderItem={({ item, width, height }) => (
                <OfferTileWrapper
                  item={item}
                  analyticsFrom="venue"
                  venueId={item.venue?.id}
                  width={width}
                  height={height}
                  searchId={routeParams?.searchId}
                />
              )}
              keyExtractor={keyExtractor}
              seeAllButton={{
                onBeforeNavigate,
                navigateToVerticalPlaylist,
                hideSearchSeeAll: true,
              }}
            />
          </PassPlaylistContainer>
        </SectionWithDivider>
      ) : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingTop: theme.isDesktopViewport
    ? theme.designSystem.size.spacing.xxxl
    : theme.designSystem.size.spacing.xl,
  gap: theme.isDesktopViewport
    ? theme.designSystem.size.spacing.xxxl
    : theme.designSystem.size.spacing.xl,
}))

const StyledTitle3 = styled(Typo.Title3).attrs(getTextSemanticAttrs(2))(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xl,
}))

const PassPlaylistContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
