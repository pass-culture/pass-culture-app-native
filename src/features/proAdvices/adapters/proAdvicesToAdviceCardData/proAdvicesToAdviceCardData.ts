import { VenueProAdvice } from 'api/gen'
import { getFormattedAdviceDate } from 'features/advices/helpers/getFormattedAdviceDate'
import { AdviceCardData } from 'features/advices/types'
import { TagVariant } from 'ui/designSystem/Tag/types'

export function proAdvicesToAdviceCardData(advices: VenueProAdvice[]): AdviceCardData[] {
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
      date: getFormattedAdviceDate(publicationDatetime),
      tagProps: { variant: TagVariant.PROEDITO, label: author ? `par ${author}` : 'avis du pro' },
      image: offerThumbUrl,
      headerNavigateTo: { screen: 'Offer', params: { id: offerId } },
      headerAccessibilityLabel: `Voir l‘offre ${offerName}`,
    })
  )
}
