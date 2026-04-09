import { EligibilityType, OfferResponse, OfferStockResponse } from 'api/gen'
import { FREE_OFFER_CATEGORIES_TO_ARCHIVE } from 'features/bookings/constants'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
type Props = {
  offer?: OfferResponse
  selectedStock: OfferStockResponse
  quantity: 1 | 2
  user?: UserProfileResponseWithoutSurvey
  isUserUnderage: boolean
  isCguChecked: boolean
  currency: Currency
  euroToPacificFrancRate: number
}

export function getBookingDetails({
  offer,
  selectedStock,
  quantity,
  user,
  isUserUnderage,
  isCguChecked,
  currency,
  euroToPacificFrancRate,
}: Props) {
  const priceInCents = quantity * (selectedStock?.price ?? 0)

  const formattedPriceWithEuro = formatCurrencyFromCents(
    priceInCents,
    currency,
    euroToPacificFrancRate
  )

  const isNotUserFreeStatus = user?.eligibility !== EligibilityType.free

  const isStockBookable = !(isUserUnderage && selectedStock?.isForbiddenToUnderage)

  const isBookingConfirmationButtonDisabled = !isStockBookable || !isCguChecked

  const isFreeOfferToArchive =
    !!offer && FREE_OFFER_CATEGORIES_TO_ARCHIVE.includes(offer.subcategoryId)

  const deductedAmount = `${formattedPriceWithEuro} seront déduits de ton crédit pass Culture`

  return {
    formattedPriceWithEuro,
    isNotUserFreeStatus,
    isBookingConfirmationButtonDisabled,
    isFreeOfferToArchive,
    deductedAmount,
  }
}

export const getVenueBookingDetails = ({
  offer,
  nbVenueItems,
  shouldFetchSearchVenueOffers,
}: {
  offer?: OfferResponse
  nbVenueItems: number
  shouldFetchSearchVenueOffers: boolean
}) => {
  const venueStreet = offer?.address?.street || offer?.venue.address
  const venuePostalCode = offer?.address?.postalCode || offer?.venue.postalCode
  const venueCity = offer?.address?.city || offer?.venue.city
  const venueName = offer?.address?.label || offer?.venue.name
  const venueFullAddress = formatFullAddress(venueStreet, venuePostalCode, venueCity)

  const shouldDisplayOtherVenuesAvailableButton = Boolean(
    shouldFetchSearchVenueOffers && nbVenueItems > 0
  )

  return {
    venueFullAddress,
    venueName,
    shouldDisplayOtherVenuesAvailableButton,
  }
}
