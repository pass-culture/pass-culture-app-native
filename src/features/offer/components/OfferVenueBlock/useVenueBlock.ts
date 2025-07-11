import { useMemo } from 'react'

import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { formatFullAddress } from 'shared/address/addressFormatter'

export const useVenueBlock = ({
  venue,
  offerAddress,
  onCopy,
}: {
  venue: VenueBlockVenue
  offerAddress?: VenueBlockAddress
  onCopy?: () => void
}) => {
  const venueName = offerAddress?.label || venue.name
  const street = offerAddress?.street
  const postalCode = offerAddress?.postalCode ?? venue.postalCode
  const city = offerAddress?.city ?? venue.city

  const address = useMemo(
    () => formatFullAddress(street, postalCode, city),
    [street, postalCode, city]
  )

  const onCopyAddressPress = useCopyToClipboard({
    textToCopy: address,
    snackBarMessage: 'L’adresse a bien été copiée',
    onCopy,
  })

  return useMemo(
    () => ({
      venueName,
      venueAddress: address,
      isOfferAddressDifferent: offerAddress?.id !== venue?.addressId,
      onCopyAddressPress,
    }),
    [address, onCopyAddressPress, venueName, venue, offerAddress]
  )
}
