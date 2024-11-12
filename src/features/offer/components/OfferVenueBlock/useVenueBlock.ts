import Clipboard from '@react-native-clipboard/clipboard'
import { useMemo } from 'react'

import { OfferAddressResponse, OfferVenueResponse } from 'api/gen'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function useVenueBlock({
  venue,
  offerAddress,
}: {
  venue: OfferVenueResponse
  offerAddress?: OfferAddressResponse
}) {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const street = offerAddress?.street || venue.address
  const postalCode = offerAddress?.postalCode || venue.postalCode
  const city = offerAddress?.city || venue.city

  const venueName = offerAddress?.label || venue.publicName || venue.name
  const address = useMemo(
    () => formatFullAddressStartsWithPostalCode(street, postalCode, city),
    [street, postalCode, city]
  )
  const venueAddress = useMemo(
    () => formatFullAddressStartsWithPostalCode(venue.address, venue.postalCode, venue.city),
    [venue.address, venue.postalCode, venue.city]
  )

  return useMemo(
    () => ({
      venueName,
      venueAddress: address,
      isOfferAddressDifferent: address !== venueAddress,
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
    [address, venueAddress, showErrorSnackBar, showSuccessSnackBar, venueName]
  )
}
