import { OfferProAdvice } from 'api/gen'
import { getFormattedAdviceDate } from 'features/advices/helpers/getFormattedAdviceDate'
import { AdviceCardData } from 'features/advices/types'
import { analytics } from 'libs/analytics/provider'
import { humanizeDistance } from 'libs/parsers/formatDistance'
import { TagVariant } from 'ui/designSystem/Tag/types'

export function offerProAdvicesToAdviceCardData(
  advices: OfferProAdvice[],
  offerId: number
): AdviceCardData[] {
  return advices.map(
    ({ venueId, content, venueName, distance, publicationDatetime, author, venueThumbUrl }) => ({
      id: venueId,
      title: venueName,
      subtitle: distance ? `à ${humanizeDistance(distance)}` : '',
      description: content,
      date: getFormattedAdviceDate(publicationDatetime),
      tagProps: { variant: TagVariant.PROEDITO, label: author ? `par ${author}` : 'avis du pro' },
      image: venueThumbUrl,
      headerNavigateTo: { screen: 'Venue', params: { id: venueId } },
      headerAccessibilityLabel: `Voir le lieu ${venueName}`,
      onCardHeaderPress: () => {
        void analytics.logConsultVenue({
          from: 'offer',
          originDetail: 'Les avis des pros',
          adviceType: 'pro',
          offerId: offerId.toString(),
          venueId: venueId.toString(),
        })
      },
    })
  )
}
