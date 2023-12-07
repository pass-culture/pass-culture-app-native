import Clipboard from '@react-native-clipboard/clipboard'
import { useMemo } from 'react'

import { OfferVenueResponse } from 'api/gen'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function useVenueBlock({ venue }: { venue: OfferVenueResponse }) {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const address = useMemo(
    () => formatFullAddressStartsWithPostalCode(venue.address, venue.postalCode, venue.city),
    [venue.address, venue.city, venue.postalCode]
  )

  return useMemo(
    () => ({
      venueName: venue.publicName ?? venue.name,
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
    [address, showErrorSnackBar, showSuccessSnackBar, venue.name, venue.publicName]
  )
}
