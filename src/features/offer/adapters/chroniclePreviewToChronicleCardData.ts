import { ChroniclePreview } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { getChronicleCardTitle } from 'shared/chronicle/getChronicleCardTitle/getChronicleCardTitle'
import { getFormattedChronicleDate } from 'shared/chronicle/getFormattedChronicleDate/getFormattedChronicleDate'

export const chroniclePreviewToChronicalCardData = (data: ChroniclePreview): ChronicleCardData => {
  return {
    date: getFormattedChronicleDate(data.dateCreated),
    description: data.contentPreview,
    id: data.id,
    subtitle: data.author?.firstName ? 'Membre du Book Club' : '',
    title: getChronicleCardTitle(data.author),
  }
}
