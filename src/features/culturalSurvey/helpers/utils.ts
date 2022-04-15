import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { useAppSettings } from 'features/auth/settings'

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

export function useCulturalSurveyRoute() {
  const { data: settings } = useAppSettings()

  // as long as ENABLE_CULTURAL_SURVEY is still used in the api to define if user should
  // fill cultural survey, we use enableNativeCulturalSurvey to know which cultural survey
  // (native or typeform) to show
  if (settings?.enableNativeCulturalSurvey) {
    return 'CulturalSurveyIntro'
  }
  return 'CulturalSurvey'
}
