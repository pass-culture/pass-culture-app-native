import { CulturalSurveyQuestionEnum } from 'api/gen'

export const mapQuestionIdToPageTitle = (id: CulturalSurveyQuestionEnum | undefined) => {
  switch (id) {
    case CulturalSurveyQuestionEnum.SORTIES:
    case CulturalSurveyQuestionEnum.FESTIVALS:
    case CulturalSurveyQuestionEnum.SPECTACLES:
      return 'Tes sorties'
    case CulturalSurveyQuestionEnum.ACTIVITES:
      return 'Tes activités'
    default:
      return ''
  }
}
