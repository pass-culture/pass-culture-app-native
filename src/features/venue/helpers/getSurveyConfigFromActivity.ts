import { Activity } from 'api/gen'
import { VENUE_SURVEY_MAPPING } from 'features/venue/constant'
import { VenueSurveyConfig, VenueSurveyConfigWithKey, VenueSurveyKey } from 'features/venue/types'

export const getSurveyConfigFromActivity = (
  activity: Activity | null
): VenueSurveyConfigWithKey | undefined => {
  if (!activity) return undefined

  const entry = (
    Object.entries(VENUE_SURVEY_MAPPING) as [VenueSurveyKey, VenueSurveyConfig][]
  ).find(([_, config]) => config.activities.some((act) => act === activity))

  if (!entry) return undefined

  const [key, config] = entry
  return { ...config, key }
}
