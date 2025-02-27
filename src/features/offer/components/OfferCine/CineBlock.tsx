import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { isDateNotWithinNextNbDays } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { NextScreeningButton } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { OfferEventCardList } from 'features/offer/components/OfferEventCardList/OfferEventCardList'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { getAddress, getVenue } from 'features/offer/helpers/getVenueBlockProps'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { getSpacing } from 'ui/theme'

export type CineBlockProps = {
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
  nextDate?: Date
  withDivider?: boolean
}

export const CineBlock: FunctionComponent<CineBlockProps> = ({
  offer,
  onSeeVenuePress,
  nextDate,
  withDivider,
}) => {
  const { selectedDate, goToDate } = useMovieCalendar()
  const venueBlockVenue = getVenue(offer.venue)
  const venueBlockAddress = getAddress(offer.address)

  const subcategoriesMapping = useSubcategoriesMapping()

  const { onPress: onPressOfferCTA, CTAOfferModal } = useOfferCTAButton(
    offer,
    subcategoriesMapping[offer.subcategoryId]
  )

  return (
    <React.Fragment>
      <CineBlockContainer>
        <VenueBlock
          venue={venueBlockVenue}
          address={venueBlockAddress}
          onSeeVenuePress={onSeeVenuePress}
        />

        <React.Fragment>
          {nextDate ? (
            <NextScreeningButton
              date={nextDate}
              onPress={
                isDateNotWithinNextNbDays(new Date(), nextDate, 15)
                  ? () => onPressOfferCTA()
                  : () => goToDate(nextDate)
              }
            />
          ) : (
            <OfferEventCardList offer={offer} selectedDate={selectedDate} />
          )}
          {CTAOfferModal}
        </React.Fragment>
      </CineBlockContainer>
      {withDivider ? <Divider testID="divider" /> : null}
    </React.Fragment>
  )
}

const CineBlockContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingTop: getSpacing(6),
  gap: getSpacing(4),
}))

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.colors.greyMedium,
  marginHorizontal: theme.isDesktopViewport ? undefined : theme.contentPage.marginHorizontal,
  marginTop: getSpacing(theme.isDesktopViewport ? 6 : 4),
}))
