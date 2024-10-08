import { OfferResponseV2 } from 'api/gen'
import { useSubcategoriesMapping } from 'libs/subcategories'

export const useOfferSubcategory = (offer: OfferResponseV2) => {
  const subcategoriesMapping = useSubcategoriesMapping()

  return subcategoriesMapping[offer.subcategoryId]
}
