import { ChroniclePreview, SubcategoryIdEnum } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { CHRONICLE_VARIANT_CONFIG } from 'features/offer/constant'
import { getChronicleCardTitle } from 'shared/chronicle/getChronicleCardTitle/getChronicleCardTitle'
import { getFormattedChronicleDate } from 'shared/chronicle/getFormattedChronicleDate/getFormattedChronicleDate'

export const chronicleVariant: Record<SubcategoryIdEnum, ChronicleVariantInfo> = Object.fromEntries(
  CHRONICLE_VARIANT_CONFIG.flatMap(({ subcategories, ...variant }) =>
    subcategories.map((id) => [id, variant] as const)
  )
)

export const chroniclePreviewToChronicalCardData = (
  data: ChroniclePreview,
  subtitle: string
): ChronicleCardData => {
  return {
    date: getFormattedChronicleDate(data.dateCreated),
    description: data.contentPreview,
    id: data.id,
    subtitle: data.author?.firstName ? subtitle : '',
    title: getChronicleCardTitle(subtitle, data.author),
  }
}
