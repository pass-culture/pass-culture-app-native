import { OfferChronicle } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { getChronicleCardTitle } from 'shared/chronicle/getChronicleCardTitle/getChronicleCardTitle'
import { getFormattedLongMonthYear } from 'shared/date/getFormattedLongMonthYear/getFormattedLongMonthYear'

export function offerChroniclesToChronicleCardData(
  chronicles: OfferChronicle[]
): ChronicleCardData[] {
  return chronicles.map(({ id, author, content, dateCreated }) => ({
    id,
    title: getChronicleCardTitle(author),
    subtitle: author?.firstName ? 'Membre du Book Club' : '',
    description: content,
    date: getFormattedLongMonthYear(dateCreated),
  }))
}
