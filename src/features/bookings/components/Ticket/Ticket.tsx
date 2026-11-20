import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTheme } from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { BookingResponse, SubcategoryIdEnum, TicketResponse, WithdrawalTypeEnum } from 'api/gen'
import { CinemaScreeningFeatures } from 'features/bookings/components/CinemaScreeningFeatures'
import { TicketBottomPart } from 'features/bookings/components/Ticket/TicketBottomPart/TicketBottomPart'
import { TicketDisplay } from 'features/bookings/components/Ticket/TicketDisplay'
import { TicketTopPart } from 'features/bookings/components/Ticket/TicketTopPart'
import { getBookingLabelsV2, getEventOnSiteWithdrawLabelV2 } from 'features/bookings/helpers'
import { formatEventDateLabel } from 'features/bookings/helpers/getBookingLabels'
import { getTicketCinemaScreening } from 'features/bookings/helpers/getTicketCinemaScreening'
import { useArchiveBookingMutation } from 'features/bookings/queries'
import { BookingDetailsResponse } from 'features/bookings/queries/selectors/selectBookingDetails'
import { BookingProperties } from 'features/bookings/types'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { VenueBlockWithItinerary } from 'features/offer/components/OfferVenueBlock/VenueBlockWithItinerary'
import { getAddress } from 'features/offer/helpers/getVenueBlockProps'
import { UserProfile } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { IdCard } from 'ui/svg/icons/IdCard'

type TicketProps = {
  properties: BookingProperties
  booking: BookingResponse | BookingDetailsResponse
  mapping: SubcategoriesMapping
  user: UserProfile
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
  const { designSystem } = useTheme()
  const enableSpecialEventScreenings = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_SPECIAL_EVENT_SCREENINGS
  )

  const { mutate: archiveBooking } = useArchiveBookingMutation({
    bookingId: booking.id,
    onSuccess: () => {
      showSuccessSnackBar(
        'La réservation a bien été archivée. Tu pourras la retrouver dans tes réservations terminées'
      )
      goBack()
    },
    onError: (error) => {
      showErrorSnackBar(extractApiErrorMessage(error))
    },
  })

  const { offer } = booking.stock
  const cinemaScreening = getTicketCinemaScreening(booking, enableSpecialEventScreenings)
  const onPressCinemaScreeningDetails = cinemaScreening?.hasDetails
    ? () => navigate('CinemaScreeningDetailsModal', { id: booking.id })
    : undefined
  const { address, subcategoryId } = offer

  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const shouldArchiveOnPartnerPress = subcategoryId !== SubcategoryIdEnum.CINE_VENTE_DISTANCE

  const handleArchiveOnPartnerPress = () => {
    if (shouldArchiveOnPartnerPress) archiveBooking()
  }

  const { hourLabel, dayLabel } = getBookingLabelsV2.getBookingLabels(booking, properties)

  const onSiteWithdrawLabel =
    ticket.withdrawal.type === WithdrawalTypeEnum.on_site
      ? getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
          booking.stock.beginningDatetime,
          ticket.withdrawal.delay,
          false
        )
      : undefined

  const venueBlockAddress = getAddress(offer.address)

  const handleOnSeeVenuePress = async () => {
    await analytics.logConsultVenue({
      venueId: offer.venue.id.toString(),
      from: 'bookings',
    })
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

  const displayVenueAddress = !offer.isDigital

  return (
    <TicketDisplay
      onTopBlockLayout={setTopBlockHeight}
      display={display}
      topContent={
        <TicketTopPart
          user={user}
          day={dayLabel === '' ? undefined : dayLabel}
          hour={hourLabel === '' ? undefined : hourLabel}
          isDuo={properties.isDuo}
          ean={booking.stock.offer.extraData?.ean ?? undefined}
          expirationDate={expirationDateFormated({ prefix: 'À récupérer avant le ' })}
          title={offer.name}
          offer={offer}
          mapping={mapping}
          withdrawLabel={onSiteWithdrawLabel}
          cinemaScreeningFeatures={
            cinemaScreening ? (
              <CinemaScreeningFeatures
                features={cinemaScreening.features}
                onPressDetails={onPressCinemaScreeningDetails}
              />
            ) : undefined
          }
          venueInfo={
            <VenueBlockWithItinerary
              properties={properties}
              offerFullAddress={offerFullAddress}
              venue={booking.stock.offer.venue}
              address={displayVenueAddress ? booking.stock.offer.address : undefined}
              offerId={offer.id}
              thumbnailSize={designSystem.size.image.xxs}
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
          expirationDate={expirationDateFormated({ prefix: `avant le ` })}
          beginningDateTime={booking.stock.beginningDatetime ?? undefined}
          completedUrl={booking.completedUrl ?? undefined}
          offerId={offer.id}
          subcategoryId={offer.subcategoryId}
          onBeforeNavigate={handleArchiveOnPartnerPress}
        />
      }
      infoBanner={properties.isDigital ? undefined : infoBanner}
    />
  )
}
