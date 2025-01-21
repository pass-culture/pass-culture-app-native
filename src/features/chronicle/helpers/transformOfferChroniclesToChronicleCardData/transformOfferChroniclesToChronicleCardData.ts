import { OfferChronicle } from 'api/gen'
import { getChronicleCardTitle } from 'features/chronicle/helpers/getChronicleCardTitle/getChronicleCardTitle'
import { getFormattedChronicleDate } from 'features/chronicle/helpers/getFormattedChronicleDate/getFormattedChronicleDate'
import { ChronicleCardData } from 'features/chronicle/type'

export function transformOfferChroniclesToChronicleCardData(
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
