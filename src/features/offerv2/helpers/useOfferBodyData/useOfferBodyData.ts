import { CategoryIdEnum, OfferResponse, SubcategoryIdEnum } from 'api/gen'
import { extractStockDates } from 'features/offer/helpers/extractStockDates/extractStockDates'
import { getFormattedAddress } from 'features/offer/helpers/getFormattedAddress/getFormattedAddress'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { capitalizeFirstLetter, getFormattedDates } from 'libs/parsers'
import { useSubcategoriesMapping } from 'libs/subcategories'

type Props = {
  offer: OfferResponse
}

export type UseOfferBodyDataType = {
  isMultivenueCompatibleOffer: boolean
  categoryId: CategoryIdEnum
  appLabel: string
  showVenueBanner: boolean
  fullAddress: string
  shouldDisplayEventDate: boolean
  shouldShowAccessibility: boolean
  venueSectionTitle: string
  capitalizedFormattedDate?: string
}

export const useOfferBodyData = ({ offer }: Props): UseOfferBodyDataType => {
  const isMultivenueCompatibleOffer = Boolean(
    offer.subcategoryId === SubcategoryIdEnum.LIVRE_PAPIER ||
      offer.subcategoryId === SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE
  )

  const { accessibility, venue } = offer
  const mapping = useSubcategoriesMapping()
  const { categoryId, isEvent, appLabel } = mapping[offer.subcategoryId] ?? {}

  const showVenueBanner = venue.isPermanent === true
  const fullAddress = getFormattedAddress(venue, showVenueBanner)

  const dates = extractStockDates(offer)
  const formattedDate = getFormattedDates(dates)
  const capitalizedFormattedDate = capitalizeFirstLetter(formattedDate)

  const shouldDisplayEventDate = isEvent && !!formattedDate
  const shouldShowAccessibility = Object.values(accessibility).some(
    (value) => value !== undefined && value !== null
  )

  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, isEvent)

  return {
    isMultivenueCompatibleOffer,
    categoryId,
    appLabel,
    showVenueBanner,
    fullAddress,
    capitalizedFormattedDate,
    shouldDisplayEventDate,
    shouldShowAccessibility,
    venueSectionTitle,
  }
}
