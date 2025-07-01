import { ChroniclePreview } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { getChronicleCardTitle } from 'shared/chronicle/getChronicleCardTitle/getChronicleCardTitle'
import { getFormattedChronicleDate } from 'shared/chronicle/getFormattedChronicleDate/getFormattedChronicleDate'

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
