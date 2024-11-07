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
  metadataLocation?: unknown
}) {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  let venueAddress = venue.address
  let venuePostalCode = venue.postalCode
  let venueCity = venue.city
  if (
    metadataLocation instanceof Object &&
    'address' in metadataLocation &&
    metadataLocation?.address instanceof Object
  ) {
    venueAddress =
      'streetAddress' in metadataLocation.address &&
      typeof metadataLocation.address.streetAddress === 'string'
        ? metadataLocation?.address?.streetAddress
        : venue.address
    venuePostalCode =
      'postalCode' in metadataLocation.address &&
      typeof metadataLocation?.address?.postalCode === 'string'
        ? metadataLocation?.address?.postalCode
        : venue.postalCode
    venueCity =
      'addressLocality' in metadataLocation.address &&
      typeof metadataLocation?.address?.addressLocality === 'string'
        ? metadataLocation?.address?.addressLocality
        : venue.city
  }
  const address = useMemo(
    () => formatFullAddressStartsWithPostalCode(venueAddress, venuePostalCode, venueCity),
    [venueAddress, venuePostalCode, venueCity]
  )
  const venueName =
    metadataLocation instanceof Object &&
    'name' in metadataLocation &&
    typeof metadataLocation?.name === 'string'
      ? metadataLocation?.name
      : venue.publicName || venue.name

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
