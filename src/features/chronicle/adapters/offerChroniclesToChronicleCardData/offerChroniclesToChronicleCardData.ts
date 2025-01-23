import { OfferChronicle } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { getChronicleCardTitle } from 'shared/chronicle/getChronicleCardTitle/getChronicleCardTitle'
import { getFormattedChronicleDate } from 'shared/chronicle/getFormattedChronicleDate/getFormattedChronicleDate'

export function offerChroniclesToChronicleCardData(
  chronicles: OfferChronicle[]
): ChronicleCardData[] {
  return chronicles.map(({ id, author, content, dateCreated }) => ({
    id,
    title: getChronicleCardTitle(author),
    subtitle: author?.firstName ? 'Membre du Book Club' : '',
    description: content,
    date: getFormattedChronicleDate(dateCreated),
  }))
}
