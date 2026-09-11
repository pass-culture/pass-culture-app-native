import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { VenueScreenings } from 'api/gen'
import { useMovieCalendarV2 } from 'features/offer/components/MoviesScreeningCalendarV2/MovieCalendarContextV2'
import { NextScreeningButtonV2 } from 'features/offer/components/MoviesScreeningCalendarV2/NextScreeningButtonV2'
import { OfferEventCardListV2 } from 'features/offer/components/OfferEventCardList/OfferEventCardListV2'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { LocationMode } from 'libs/location/types'
import { locationStore } from 'libs/locationV2/location.store'
import { formatDateWithTimeZoneOffset } from 'libs/parsers/formatDates'
import { humanizeDistance } from 'libs/parsers/formatDistance'

type CineBlockV2Props = {
  offerId: number
  venueScreenings: VenueScreenings
  onSeeVenuePress?: VoidFunction
  withDivider?: boolean
}

export const CineBlockV2: FunctionComponent<CineBlockV2Props> = ({
  offerId,
  venueScreenings,
  onSeeVenuePress,
  withDivider,
}) => {
  const { goToDate } = useMovieCalendarV2()
  const locationMode = locationStore.hooks.useLocationMode()

  const distance = humanizeDistance(venueScreenings.distance).replace('.', ',')
  const nextDate = venueScreenings.nextScreening?.beginningDatetime
    ? formatDateWithTimeZoneOffset(venueScreenings.nextScreening?.beginningDatetime, 'yyyy-MM-dd')
    : null
  const showNextScreeningButton = venueScreenings.dayScreenings.length === 0 && !!nextDate

  return (
    <React.Fragment>
      <CineBlockContainer>
        <VenueBlock
          venueId={venueScreenings.venueId}
          title={venueScreenings.label}
          subtitle={venueScreenings.address}
          onSeeVenuePress={onSeeVenuePress}
          venueImageUrl={venueScreenings.thumbUrl ?? undefined}
          distance={distance}
          hasVenuePage={!!onSeeVenuePress}
          shouldShowDistances={
            locationMode !== LocationMode.EVERYWHERE && venueScreenings.distance !== 0
          }
          isOfferAtSameAddressAsVenue
        />

        {showNextScreeningButton ? (
          <NextScreeningButtonV2 date={nextDate} onPress={() => goToDate(nextDate)} />
        ) : (
          <OfferEventCardListV2 venueScreenings={venueScreenings} offerId={offerId} />
        )}
      </CineBlockContainer>
      {withDivider ? <Divider testID="divider" /> : null}
    </React.Fragment>
  )
}

const CineBlockContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingTop: theme.designSystem.size.spacing.xl,
  gap: theme.designSystem.size.spacing.l,
}))

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginHorizontal: theme.isDesktopViewport ? undefined : theme.contentPage.marginHorizontal,
  marginTop: theme.isDesktopViewport
    ? theme.designSystem.size.spacing.xl
    : theme.designSystem.size.spacing.l,
}))
