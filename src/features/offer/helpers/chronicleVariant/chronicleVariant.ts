import { SubcategoryIdEnum } from 'api/gen'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { CHRONICLE_VARIANT_CONFIG } from 'features/offer/constant'

export const chronicleVariant: Record<SubcategoryIdEnum, ChronicleVariantInfo> = Object.fromEntries(
  CHRONICLE_VARIANT_CONFIG.map(({ subcategories, ...variant }) =>
    subcategories.map((id) => [id, variant] as const)
  ).flat()
)
