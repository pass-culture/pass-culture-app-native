// eslint-disable-next-line no-restricted-imports
import { NetInfoState } from '@react-native-community/netinfo'

import { BookingListItemResponse, CategoryIdEnum } from 'api/gen'
import { expirationDateUtilsV2 } from 'features/bookings/helpers'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { TileContentType, tileAccessibilityLabel } from 'libs/tileAccessibilityLabel'
import { PartialOffer } from 'shared/offer/usePrePopulateOffer'
import { SegmentResult } from 'shared/useABSegment/useABSegment'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

type EndedBookingItem = {
  booking: BookingListItemResponse
  categoryId: CategoryIdEnum
  netInfo: NetInfoState
  prePopulateOffer: (offer: PartialOffer) => void
  segment: SegmentResult
  showErrorSnackBar: (props: SnackBarHelperSettings) => void
}

export const getEndedBookingItemProperties = ({
  booking,
  categoryId,
  netInfo,
  prePopulateOffer,
  segment,
  showErrorSnackBar,
}: EndedBookingItem) => {
  const { dateUsed, cancellationDate, cancellationReason, stock } = booking
  const { offer } = stock

  const isBookingEligibleForArchive = !!expirationDateUtilsV2.isArchivableBooking(booking)
  const shouldRedirectToBooking = isBookingEligibleForArchive && !cancellationReason

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.BOOKING, {
    name: offer.name,
    dateUsed: dateUsed ? formatToSlashedFrenchDate(dateUsed) : undefined,
    cancellationDate: cancellationDate ? formatToSlashedFrenchDate(cancellationDate) : undefined,
  })

  const handlePressOffer = async () => {
    if (!offer.id) return
    if (shouldRedirectToBooking)
      await analytics.logViewedBookingPage({
        offerId: offer.id,
        from: 'endedbookings',
      })
    if (isBookingEligibleForArchive) return
    if (netInfo.isConnected) {
      // We pre-populate the query-cache with the data from the search result for a smooth transition
      prePopulateOffer({
        ...offer,
        categoryId,
        thumbUrl: offer.imageUrl ?? '',
        name: offer.name,
        offerId: offer.id,
      })

      triggerConsultOfferLog(
        {
          offerId: offer.id,
          from: 'endedbookings',
        },
        segment
      )
    } else {
      showErrorSnackBar({
        message:
          'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  const navigateTo = shouldRedirectToBooking
    ? ({ screen: 'BookingDetails', params: { id: booking.id } } as const)
    : ({ screen: 'Offer', params: { id: offer.id, from: 'endedbookings' } } as const)

  return {
    accessibilityLabel,
    isBookingEligibleForArchive,
    handlePressOffer,
    navigateTo,
  }
}
