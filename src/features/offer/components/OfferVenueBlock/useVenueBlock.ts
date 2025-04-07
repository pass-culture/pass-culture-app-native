import { useMemo } from 'react'

import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { formatFullAddress } from 'shared/address/addressFormatter'

export function useVenueBlock({
  venue,
  offerAddress,
  onCopy,
}: {
  venue: VenueBlockVenue
  offerAddress?: VenueBlockAddress
  onCopy?: () => void
}) {
  const venueName = offerAddress?.label || venue.name
  const street = offerAddress?.street ?? venue.address
  const postalCode = offerAddress?.postalCode ?? venue.postalCode
  const city = offerAddress?.city ?? venue.city

  const address = useMemo(
    () => formatFullAddress(street, postalCode, city),
    [street, postalCode, city]
  )
  const venueAddress = useMemo(
    () => formatFullAddress(venue.address, venue.postalCode, venue.city),
    [venue.address, venue.postalCode, venue.city]
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
      isOfferAddressDifferent: address !== venueAddress,
      onCopyAddressPress,
    }),
    [address, onCopyAddressPress, venueAddress, venueName]
  )
}
