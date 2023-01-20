import { useSettingsContext } from 'features/auth/context/SettingsContext'

export function useCulturalSurveyRoute() {
  const { data: settings } = useSettingsContext()

  // as long as ENABLE_CULTURAL_SURVEY is still used in the api to define if user should
  // fill cultural survey, we use enableNativeCulturalSurvey to know which cultural survey
  // (native or typeform) to show
  if (settings?.enableNativeCulturalSurvey) {
    return 'CulturalSurveyIntro'
  }
  return 'CulturalSurvey'
}
