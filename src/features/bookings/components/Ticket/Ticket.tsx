import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { BookingOfferResponseAddress, BookingResponse, TicketResponse } from 'api/gen'
import { TicketBottomPart } from 'features/bookings/components/Ticket/TicketBottomPart/TicketBottomPart'
import { TicketDisplay } from 'features/bookings/components/Ticket/TicketDisplay'
import { TicketTopPart } from 'features/bookings/components/Ticket/TicketTopPart'
import { getBookingLabelsV2 } from 'features/bookings/helpers'
import { formatEventDateLabel } from 'features/bookings/helpers/getBookingLabels'
import { useArchiveBookingMutation } from 'features/bookings/queries'
import { BookingProperties } from 'features/bookings/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueBlockAddress } from 'features/offer/components/OfferVenueBlock/type'
import { VenueBlockWithItinerary } from 'features/offer/components/OfferVenueBlock/VenueBlockWithItinerary'
import { getAddress } from 'features/offer/helpers/getVenueBlockProps'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { IdCard } from 'ui/svg/icons/IdCard'

const VENUE_THUMBNAIL_SIZE = 60

type TicketProps = {
  properties: BookingProperties
  booking: BookingResponse
  mapping: SubcategoriesMapping
  user: UserProfileResponseWithoutSurvey
  display: 'punched' | 'full'
  setTopBlockHeight: React.Dispatch<React.SetStateAction<number>>
  ticket: TicketResponse
}

export const Ticket = ({
  properties,
  booking,
  mapping,
  setTopBlockHeight,
  user,
  display,
  ticket,
}: TicketProps) => {
  const { navigate, goBack } = useNavigation<UseNavigationType>()

  const { showErrorSnackBar, showSuccessSnackBar } = useSnackBarContext()
  const { mutate: archiveBooking } = useArchiveBookingMutation({
    bookingId: booking.id,
    onSuccess: () => {
      showSuccessSnackBar({
        message:
          'La réservation a bien été archivée. Tu pourras la retrouver dans tes réservations terminées',
        timeout: SNACK_BAR_TIME_OUT,
      })
      goBack()
    },
    onError: (error) => {
      showErrorSnackBar({
        message: extractApiErrorMessage(error),
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const { address } = booking?.stock.offer ?? {}

  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const { offer } = booking.stock

  const { hourLabel, dayLabel } = getBookingLabelsV2.getBookingLabels(booking, properties)

  const venueBlockAddress = getAddress(offer.address)

  const handleOnSeeVenuePress = async () => {
    await analytics.logConsultVenue({ venueId: offer.venue.id.toString(), from: 'bookings' })
    navigate('Venue', { id: offer.venue.id })
  }
  const expirationDateFormated = ({ prefix }: { prefix: string }) => {
    return booking.expirationDate
      ? formatEventDateLabel({
          date: booking.expirationDate,
          timezone: offer.venue.timezone,
          shouldDisplayWeekDay: false,
          format: 'dateWithoutYear',
          prefix,
        })
      : undefined
  }
  const infoBanner = (
    <Banner
      label={`Tu auras besoin de ta carte d’identité pour ${properties.isEvent ? 'accéder à l’évènement' : 'récupérer ta réservation'}.`}
      Icon={IdCard}
    />
  )

  return (
    <TicketDisplay
      onTopBlockLayout={setTopBlockHeight}
      display={display}
      topContent={
        <TicketTopPart
          user={user}
          day={dayLabel == '' ? undefined : dayLabel}
          hour={hourLabel == '' ? undefined : hourLabel}
          isDuo={properties.isDuo}
          ean={booking.stock.offer.extraData?.ean ?? undefined}
          expirationDate={expirationDateFormated({ prefix: 'À récupérer avant le ' })}
          title={offer.name}
          offer={offer}
          mapping={mapping}
          venueInfo={
            <VenueBlockWithItinerary
              properties={properties}
              offerFullAddress={offerFullAddress}
              venue={booking.stock.offer.venue}
              address={getVenueBlockAddress(booking.stock.offer.address)}
              offerId={offer.id}
              thumbnailSize={VENUE_THUMBNAIL_SIZE}
              addressLabel={venueBlockAddress?.label ?? undefined}
              onSeeVenuePress={offer.venue.isOpenToPublic ? handleOnSeeVenuePress : undefined}
            />
          }
        />
      }
      bottomContent={
        <TicketBottomPart
          isDuo={properties.isDuo ?? false}
          ticket={ticket}
          userEmail={user?.email}
          isDigital={properties.isDigital ?? false}
          isEvent={properties.isEvent ?? false}
          expirationDate={expirationDateFormated({ prefix: `avant le ` })}
          beginningDateTime={booking.stock.beginningDatetime ?? undefined}
          completedUrl={booking.completedUrl ?? undefined}
          offerId={offer.id}
          subcategoryId={offer.subcategoryId}
          onBeforeNavigate={archiveBooking}
        />
      }
      infoBanner={properties.isDigital ? undefined : infoBanner}
    />
  )
}

const getVenueBlockAddress = (
  address: BookingOfferResponseAddress | null | undefined
): VenueBlockAddress | undefined => {
  return address ?? undefined
}
