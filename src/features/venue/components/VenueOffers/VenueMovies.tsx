import React, { useEffect } from 'react'
import { InView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import type { VenueOffers } from 'features/venue/types'
import { Anchor } from 'ui/components/anchor/Anchor'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const cinemaCTAButtonName = 'Accéder aux séances'

export const VenueMovies: React.FC<{ venueMovieOffers: VenueOffers }> = ({ venueMovieOffers }) => {
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

      <MoviesScreeningCalendar venueMovieOffers={venueMovieOffers} />
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
