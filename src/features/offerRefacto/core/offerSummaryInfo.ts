import { OfferResponseV2 } from 'api/gen'
import { extractStockDates, formatDuration, getOfferLocationName } from 'features/offerRefacto/core'
import { capitalize } from 'libs/formatter/capitalize'
import { getFormattedDates } from 'libs/parsers/formatDates'
import { formatFullAddress } from 'shared/address/addressFormatter'

export const getOfferSummaryInfoData = (offer: OfferResponseV2) => {
  const { venue, isDigital, extraData, address } = offer

  const dates = extractStockDates(offer)
  const formattedDate = capitalize(getFormattedDates(dates))
  const locationName = getOfferLocationName(venue, isDigital)

  const duration = extraData?.durationMinutes
    ? formatDuration(extraData.durationMinutes).label
    : undefined

  const fullAddressOffer = formatFullAddress(address?.street, address?.postalCode, address?.city)
  const fullAddressVenue = formatFullAddress(venue.address, venue.postalCode, venue.city)

  return {
    formattedDate,
    locationName,
    duration,
    fullAddressOffer,
    fullAddressVenue,
    addressLabel: address?.label,
    isDuo: offer.isDuo,
    isDigital: offer.isDigital,
  }
}
