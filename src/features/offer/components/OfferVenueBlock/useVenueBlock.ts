import Clipboard from '@react-native-clipboard/clipboard'
import { useMemo } from 'react'

import { OfferVenueResponse } from 'api/gen'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function useVenueBlock({
  venue,
  metadataLocation,
}: {
  venue: OfferVenueResponse
  metadataLocation?: any
}) {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const venueAddress = metadataLocation?.address?.streetAddress || venue.address
  const venuePostalCode = metadataLocation?.address?.postalCode || venue.postalCode
  const venueCity = metadataLocation?.address?.addressLocality || venue.city

  const address = useMemo(
    () => formatFullAddressStartsWithPostalCode(venueAddress, venuePostalCode, venueCity),
    [venueAddress, venuePostalCode, venueCity]
  )
  const venueName = metadataLocation?.name || venue.publicName || venue.name

  return useMemo(
    () => ({
      venueName,
      address,
      onCopyAddressPress: async () => {
        Clipboard.setString(address)
        if ((await Clipboard.getString()) === address) {
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
    [address, showErrorSnackBar, showSuccessSnackBar, venueName]
  )
}
