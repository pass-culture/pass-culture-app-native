import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'
import { formatFullAddress } from 'shared/address/addressFormatter'

export const getVenueBlock = ({
  venue,
  offerAddress,
}: {
  venue: VenueBlockVenue
  offerAddress?: VenueBlockAddress
}) => {
  const venueName = offerAddress?.label || venue.name
  const street = offerAddress?.street || venue?.address
  const postalCode = offerAddress?.postalCode ?? venue.postalCode
  const city = offerAddress?.city ?? venue.city

  const address = formatFullAddress(street, postalCode, city)

  const onCopyAddressPress = () =>
    copyToClipboard({
      textToCopy: address,
      snackBarMessage: 'L’adresse a bien été copiée',
    })

  return {
    venueName,
    venueAddress: address,
    isOfferAddressDifferent: offerAddress?.id !== venue?.addressId,
    onCopyAddressPress,
  }
}
