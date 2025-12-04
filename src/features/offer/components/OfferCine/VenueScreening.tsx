import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OfferResponseV2, VenueScreenings } from 'api/gen'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { isDateNotWithinNextNbDays } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { NextScreeningButton } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { getAddress } from 'features/offer/helpers/getVenueBlockProps'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { EventCardProps } from 'ui/components/eventCard/EventCard'
import { EventCardList } from 'ui/components/eventCard/EventCardList'

export type CineBlockProps = {
  venueScreening: VenueScreenings
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
  withDivider?: boolean
}

export const VenueScreening: FunctionComponent<CineBlockProps> = ({
  venueScreening: { venueId, address, thumbUrl, dayScreenings, distance, label, nextScreening },
  offer,
  onSeeVenuePress,
  withDivider,
}) => {
  const { selectedDate, goToDate } = useMovieCalendar()

  const subcategoriesMapping = useSubcategoriesMapping()

  const { onPress: onPressOfferCTA, CTAOfferModal } = useOfferCTAButton(
    offer,
    subcategoriesMapping[offer.subcategoryId]
  )

  const venueBlockAddress = getAddress(offer.address)

  const { isOfferAddressDifferent } = useVenueBlock({
    venue: offer.venue,
    offerAddress: venueBlockAddress,
  })
  const segment = useABSegment()

  const nextDate = nextScreening ? new Date(nextScreening.beginningDatetime) : undefined

  const eventCardListProps: EventCardProps[] = dayScreenings.map((item, index) => {
    return {
      isDisabled: false,
      onPress: () => null,
      segment,
      subtitleLeft: String(index),
      title: String(index),
      analyticsFrom: 'venue',
      subtitleRight: String(index),
    }
  })

  const shouldDisplayNextDate = dayScreenings.length === 0 && nextDate

  return (
    <React.Fragment>
      <CineBlockContainer>
        <VenueBlock
          venueId={venueId}
          title={label}
          subtitle={address}
          onSeeVenuePress={onSeeVenuePress}
          venueImageUrl={thumbUrl ?? undefined}
          distance={String(distance)}
          hasVenuePage={!!onSeeVenuePress && !isOfferAddressDifferent}
          isOfferAtSameAddressAsVenue
        />
        {shouldDisplayNextDate ? (
          <NextScreeningButton
            date={nextDate}
            onPress={
              isDateNotWithinNextNbDays(new Date(), nextDate, 15)
                ? () => onPressOfferCTA()
                : () => goToDate(nextDate)
            }
          />
        ) : (
          <EventCardList data={eventCardListProps} />
          // <OfferEventCardList offer={offer} selectedDate={selectedDate} />
        )}
        {CTAOfferModal}
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
