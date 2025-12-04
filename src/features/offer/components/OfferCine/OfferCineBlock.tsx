import { useRoute } from '@react-navigation/native'
import React, { FC, useCallback, useEffect } from 'react'
import { ViewStyle } from 'react-native'
import { InView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { NewOfferCineContent } from 'features/offer/components/OfferCine/NewOfferCineContent'
import { OfferCineContent } from 'features/offer/components/OfferCine/OfferCineContent'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { getDates } from 'shared/date/getDates'
import { AppThemeType } from 'theme'
import { Anchor } from 'ui/components/anchor/Anchor'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  title: string
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
}

const cinemaCTAButtonName = 'Accéder aux séances'

export const OfferCineBlock: FC<Props> = ({ title, onSeeVenuePress, offer }) => {
  const theme = useTheme()
  const route = useRoute<UseRouteType<'Offer'>>()
  const from = route.params?.from
  const { setButton, showButton } = useOfferCTA()
  const scrollToAnchor = useScrollToAnchor()

  useEffect(() => {
    setButton(cinemaCTAButtonName, () => {
      scrollToAnchor(AnchorNames.OFFER_CINE_AVAILABILITIES)
    })

    return () => {
      setButton('', () => null)
    }
  }, [scrollToAnchor, setButton])
  const next15Dates = getDates(new Date(), 15)

  const handleLayout = useCallback(() => {
    if (from === 'chronicles') {
      scrollToAnchor(AnchorNames.OFFER_CINE_AVAILABILITIES)
    }
  }, [from, scrollToAnchor])

  return (
    <Container testID="offer-new-xp-cine-block" gap={4} onLayout={handleLayout}>
      <Anchor name={AnchorNames.OFFER_CINE_AVAILABILITIES}>
        <InView
          onChange={(inView) => {
            showButton(!inView)
          }}>
          <TitleContainer>
            <Typo.Title3 {...getHeadingAttrs(2)}>{title}</Typo.Title3>
          </TitleContainer>
        </InView>
      </Anchor>
      <MovieCalendarProvider initialDates={next15Dates} containerStyle={getCalendarStyle(theme)}>
        <OfferCineContent offer={offer} onSeeVenuePress={onSeeVenuePress} />
      </MovieCalendarProvider>
      <MovieCalendarProvider containerStyle={getCalendarStyle(theme)}>
        <NewOfferCineContent offer={offer} onSeeVenuePress={onSeeVenuePress} />
      </MovieCalendarProvider>
    </Container>
  )
}

const getCalendarStyle = (theme: AppThemeType): ViewStyle => ({
  marginRight: theme.isDesktopViewport ? -getSpacing(16) : 0,
})

const Container = styled(ViewGap)({
  marginVertical: 0,
})

const TitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.isDesktopViewport ? undefined : theme.contentPage.marginHorizontal,
}))
