import { useRoute } from '@react-navigation/native'
import React, { FC, useCallback, useEffect } from 'react'
import { ViewStyle } from 'react-native'
import { InView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { OfferCineContentV2 } from 'features/offer/components/OfferCine/OfferCineContentV2'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { useOfferMovieCalendarQuery } from 'features/offer/queries/useMovieCalendarQuery'
import { AppThemeType } from 'theme'
import { Anchor } from 'ui/components/anchor/Anchor'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  title: string
  offerId: number
  allocineId?: string | null
  visa?: string | null
  offerVenueLatitude?: number | null
  offerVenueLongitude?: number | null
  onSeeVenuePress?: VoidFunction
}

const cinemaCTAButtonName = 'Accéder aux séances'

export const OfferCineBlockV2: FC<Props> = ({
  title,
  onSeeVenuePress,
  offerId,
  allocineId,
  visa,
  offerVenueLatitude,
  offerVenueLongitude,
}) => {
  const theme = useTheme()
  const { data: movieCalendar, isLoading } = useOfferMovieCalendarQuery({
    offerId,
    allocineId,
    visa,
    offerVenueLatitude,
    offerVenueLongitude,
  })
  const { calendar } = movieCalendar ?? { calendar: [] }
  const calendarDates = calendar?.map((dayVenueScreenings) => new Date(dayVenueScreenings.date))
  const route = useRoute<UseRouteType<'ClubAdvices'>>()
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

  const handleLayout = useCallback(() => {
    if (from === 'chronicles') {
      scrollToAnchor(AnchorNames.OFFER_CINE_AVAILABILITIES)
    }
  }, [from, scrollToAnchor])

  return isLoading || !offerId ? null : (
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
      <MovieCalendarProvider initialDates={calendarDates} containerStyle={getCalendarStyle(theme)}>
        <OfferCineContentV2
          offerId={offerId}
          calendar={calendar}
          isLoading={isLoading || !offerId}
          onSeeVenuePress={onSeeVenuePress}
        />
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
