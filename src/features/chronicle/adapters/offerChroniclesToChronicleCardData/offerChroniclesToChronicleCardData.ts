import { OfferChronicle } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { getChronicleCardTitle } from 'shared/chronicle/getChronicleCardTitle/getChronicleCardTitle'
import { getFormattedChronicleDate } from 'shared/chronicle/getFormattedChronicleDate/getFormattedChronicleDate'

export function offerChroniclesToChronicleCardData(
  chronicles: OfferChronicle[],
  subtitleItem: string
): ChronicleCardData[] {
  return chronicles.map(({ id, author, content, dateCreated }) => ({
    id,
    title: getChronicleCardTitle(subtitleItem, author),
    subtitle: author?.firstName ? subtitleItem : '',
    description: content,
    date: getFormattedChronicleDate(dateCreated),
  }))
}
