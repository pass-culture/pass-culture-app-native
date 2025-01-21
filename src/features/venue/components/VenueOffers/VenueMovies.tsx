import React, { useEffect } from 'react'
import { InView } from 'react-native-intersection-observer'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import type { VenueOffers } from 'features/venue/types'
import { Anchor } from 'ui/components/anchor/Anchor'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const cinemaCTAButtonName = 'Accéder aux séances'

export const VenueMovies: React.FC<{ venueOffers: VenueOffers }> = ({ venueOffers }) => {
  const { isDesktopViewport } = useTheme()
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
    <React.Fragment>
      <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
      <Anchor name="venue-cine-availabilities">
        <InView
          onChange={(inView) => {
            showButton(!inView)
          }}>
          <MoviesTitle>{'Les films à l’affiche'}</MoviesTitle>
        </InView>
      </Anchor>
      <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
      <MoviesScreeningCalendar venueOffers={venueOffers} />
    </React.Fragment>
  )
}

const MoviesTitle = styled(TypoDS.Title3).attrs(getHeadingAttrs(2))({
  marginLeft: getSpacing(6),
})
