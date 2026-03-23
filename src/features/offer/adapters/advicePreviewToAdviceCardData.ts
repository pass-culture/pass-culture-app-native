import { ChroniclePreview } from 'api/gen'
import { getFormattedAdviceDate } from 'features/advices/helpers/getFormattedAdviceDate'
import { AdviceCardData } from 'features/advices/types'
import { getClubAdviceCardTitle } from 'features/clubAdvices/helpers/getClubAdviceCardTitle'

export const advicePreviewToAdviceCardData = (
  data: ChroniclePreview,
  subtitle: string
): AdviceCardData => {
  return {
    date: getFormattedAdviceDate(data.dateCreated),
    description: data.contentPreview,
    id: data.id,
    subtitle: data.author?.firstName ? subtitle : '',
    title: getClubAdviceCardTitle(subtitle, data.author),
  }
}
