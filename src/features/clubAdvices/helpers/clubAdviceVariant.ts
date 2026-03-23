import { SubcategoryIdEnum } from 'api/gen'
import { AdviceVariantInfo } from 'features/advices/types'
import { CLUB_ADVICE_VARIANT_CONFIG } from 'features/clubAdvices/constants'

export const clubAdviceVariant: Record<SubcategoryIdEnum, AdviceVariantInfo> = Object.fromEntries(
  CLUB_ADVICE_VARIANT_CONFIG.flatMap(({ subcategories, ...variant }) =>
    subcategories.map((id) => [id, variant] as const)
  )
)
