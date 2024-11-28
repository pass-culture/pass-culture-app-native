import React, { FC, useEffect } from 'react'
import { View, ViewStyle } from 'react-native'
import { InView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { OfferCineContent } from 'features/offer/components/OfferCine/OfferCineContent'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { cinemaCTAButtonName } from 'features/venue/components/VenueOffers/VenueOffers'
import { AppThemeType } from 'theme'
import { Anchor } from 'ui/components/anchor/Anchor'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  title: string
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
}

export const OfferCineBlock: FC<Props> = ({ title, onSeeVenuePress, offer }) => {
  const theme = useTheme()
  const { setButton, showButton } = useOfferCTA()
  const scrollToAnchor = useScrollToAnchor()

  useEffect(() => {
    setButton(cinemaCTAButtonName, () => {
      scrollToAnchor('offer-cine-availabilities')
    })
  }, [scrollToAnchor, setButton])

  return (
    <Container testID="offer-new-xp-cine-block">
      <Anchor name="offer-cine-availabilities">
        <InView
          onChange={(inView) => {
            showButton(!inView)
          }}>
          <TitleContainer>
            <TypoDS.Title3 {...getHeadingAttrs(2)}>{title}</TypoDS.Title3>
          </TitleContainer>
        </InView>
      </Anchor>
      <Spacer.Column numberOfSpaces={4} />
      <MovieCalendarProvider nbOfDays={15} containerStyle={getCalendarStyle(theme)}>
        <OfferCineContent offer={offer} onSeeVenuePress={onSeeVenuePress} />
      </MovieCalendarProvider>
    </Container>
  )
}

const getCalendarStyle = (theme: AppThemeType): ViewStyle => ({
  marginRight: theme.isDesktopViewport ? -getSpacing(16) : 0,
})

const Container = styled(View)({
  marginVertical: 0,
})

const TitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.isDesktopViewport ? undefined : theme.contentPage.marginHorizontal,
}))
