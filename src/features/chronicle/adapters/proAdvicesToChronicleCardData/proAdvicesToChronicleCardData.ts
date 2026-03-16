import { VenueProAdvice } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { getFormattedChronicleDate } from 'shared/chronicle/getFormattedChronicleDate/getFormattedChronicleDate'
import { TagVariant } from 'ui/designSystem/Tag/types'

export function proAdvicesToChronicleCardData(advices: VenueProAdvice[]): ChronicleCardData[] {
  return advices.map(
    ({
      offerId,
      content,
      offerName,
      offerCategoryLabel,
      publicationDatetime,
      author,
      offerThumbUrl,
    }) => ({
      id: offerId,
      title: offerName,
      subtitle: offerCategoryLabel,
      description: content,
      date: getFormattedChronicleDate(publicationDatetime),
      tagProps: { variant: TagVariant.PROEDITO, label: `par ${author}` },
      image: offerThumbUrl,
      headerNavigateTo: { screen: 'Offer', params: { id: offerId } },
      headerAccessibilityLabel: `Voir l‘offre ${offerName}`,
    })
  )
}
