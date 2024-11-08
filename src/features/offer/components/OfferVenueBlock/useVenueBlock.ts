import Clipboard from '@react-native-clipboard/clipboard'
import { useMemo } from 'react'

import { OfferAddressResponse, OfferVenueResponse } from 'api/gen'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function useVenueBlock({
  venue,
  address,
}: {
  venue: OfferVenueResponse
  address?: OfferAddressResponse
}) {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const venueStreet = address?.street || venue.address
  const venuePostalCode = address?.postalCode || venue.postalCode
  const venueCity = address?.city || venue.city

  const venueName = address?.label || venue.publicName || venue.name
  const venueAddress = useMemo(
    () => formatFullAddressStartsWithPostalCode(venueStreet, venuePostalCode, venueCity),
    [venueStreet, venuePostalCode, venueCity]
  )

  return useMemo(
    () => ({
      venueName,
      venueAddress,
      onCopyAddressPress: async () => {
        Clipboard.setString(venueAddress)
        if ((await Clipboard.getString()) === venueAddress) {
          showSuccessSnackBar({
            message: 'L’adresse a bien été copiée',
            timeout: SNACK_BAR_TIME_OUT,
          })
        } else {
          showErrorSnackBar({
            message: 'Une erreur est survenue, veuillez réessayer',
            timeout: SNACK_BAR_TIME_OUT,
          })
        }
      },
    }),
    [venueAddress, showErrorSnackBar, showSuccessSnackBar, venueName]
  )
}
