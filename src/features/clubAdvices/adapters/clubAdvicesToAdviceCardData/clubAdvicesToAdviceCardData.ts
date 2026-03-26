import { OfferChronicle } from 'api/gen'
import { getFormattedAdviceDate } from 'features/advices/helpers/getFormattedAdviceDate'
import { AdviceCardData } from 'features/advices/types'
import { getClubAdviceCardTitle } from 'features/clubAdvices/helpers/getClubAdviceCardTitle'

export function clubAdvicesToAdviceCardData(
  advices: OfferChronicle[],
  subtitleItem: string
): AdviceCardData[] {
  return advices.map(({ id, author, content, dateCreated }) => ({
    id,
    title: getClubAdviceCardTitle(subtitleItem, author),
    subtitle: author?.firstName ? subtitleItem : '',
    description: content,
    date: getFormattedAdviceDate(dateCreated),
  }))
}
