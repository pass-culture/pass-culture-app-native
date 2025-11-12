import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { InView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { VenueOffers } from 'features/venue/types'
import { Offer } from 'shared/offer/types'
import { Anchor } from 'ui/components/anchor/Anchor'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { LENGTH_M, RATIO_HOME_IMAGE, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const cinemaCTAButtonName = 'Accéder aux séances'

const keyExtractor = (item: Offer) => item.objectID

export const VenueMovies: React.FC<{
  venueOffers: VenueOffers
}> = ({ venueOffers }) => {
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

  return (
    <Container>
      <Anchor name={AnchorNames.VENUE_CINE_AVAILABILITIES}>
        <InView
          onChange={(inView) => {
            showButton(!inView)
          }}>
          <MoviesTitle>{'Les films à l’affiche'}</MoviesTitle>
        </InView>
      </Anchor>

      <MoviesScreeningCalendar venueOffers={venueOffers} />
      {nonMovieScreeningOffers.length ? (
        <SectionWithDivider visible margin={false} gap={6}>
          <PassPlaylistContainer>
            <PassPlaylist
              testID="offersModuleList"
              title="Les autres offres"
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

const MoviesTitle = styled(Typo.Title3).attrs(getHeadingAttrs(2))(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xl,
}))

const PassPlaylistContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
