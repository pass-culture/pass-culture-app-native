import { CulturalSurveyQuestionEnum } from 'api/gen'

export const mapQuestionIdToPageTitle = (id: CulturalSurveyQuestionEnum | undefined) => {
  switch (id) {
    case CulturalSurveyQuestionEnum.SORTIES:
    case CulturalSurveyQuestionEnum.FESTIVALS:
    case CulturalSurveyQuestionEnum.SPECTACLES:
    case CulturalSurveyQuestionEnum.PROJECTIONS:
      return 'Tes sorties'
    case CulturalSurveyQuestionEnum.ACTIVITES:
      return 'Tes activités'
    case CulturalSurveyQuestionEnum.LIVRES:
      return 'Tes lectures'
    case CulturalSurveyQuestionEnum.MUSIQUES:
      return 'Tes musiques'
    default:
      return ''
  }
}
