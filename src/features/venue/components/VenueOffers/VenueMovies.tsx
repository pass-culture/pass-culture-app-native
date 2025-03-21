import React, { useEffect } from 'react'
import { InView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import type { VenueOffers } from 'features/venue/types'
import { Anchor } from 'ui/components/anchor/Anchor'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const cinemaCTAButtonName = 'Accéder aux séances'

export const VenueMovies: React.FC<{ venueOffers: VenueOffers }> = ({ venueOffers }) => {
  const { setButton, showButton } = useOfferCTA()
  const scrollToAnchor = useScrollToAnchor()

  useEffect(() => {
    setButton(cinemaCTAButtonName, () => {
      scrollToAnchor('venue-cine-availabilities')
    })

    return () => {
      setButton('', () => null)
    }
  }, [scrollToAnchor, setButton])

  return (
    <Container>
      <Anchor name="venue-cine-availabilities">
        <InView
          onChange={(inView) => {
            showButton(!inView)
          }}>
          <MoviesTitle>{'Les films à l’affiche'}</MoviesTitle>
        </InView>
      </Anchor>

      <MoviesScreeningCalendar venueOffers={venueOffers} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingTop: theme.isDesktopViewport ? getSpacing(10) : getSpacing(6),
  gap: theme.isDesktopViewport ? getSpacing(10) : getSpacing(6),
}))

const MoviesTitle = styled(Typo.Title3).attrs(getHeadingAttrs(2))({
  marginLeft: getSpacing(6),
})
