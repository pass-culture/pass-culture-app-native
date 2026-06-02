import { CulturalSurveyQuestionEnum } from 'api/gen'

export const mapQuestionIdToPageTitle = (id: CulturalSurveyQuestionEnum | undefined) => {
  switch (id) {
    case CulturalSurveyQuestionEnum.SORTIES:
    case CulturalSurveyQuestionEnum.FESTIVALS:
    case CulturalSurveyQuestionEnum.SPECTACLES:
      return 'Tes sorties'
    case CulturalSurveyQuestionEnum.ACTIVITES:
    case CulturalSurveyQuestionEnum.LIVRES:
    case CulturalSurveyQuestionEnum.MUSIQUES:
      return 'Tes activités'
    case CulturalSurveyQuestionEnum.PROJECTIONS:
    default:
      return ''
  }
}
