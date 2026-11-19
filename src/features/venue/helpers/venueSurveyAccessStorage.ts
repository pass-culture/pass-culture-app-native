import { VenueSurveyKey } from 'features/venue/types'
import { storage, StorageKey } from 'libs/storage'

type SurveyDisplayType = 'modal' | 'banner'

const getStorageKey = (venueSurvey: VenueSurveyKey, type: SurveyDisplayType): StorageKey =>
  `${venueSurvey}_${type}_venue_survey`

export const checkVenueSurveyAccess = async (
  venueSurvey: VenueSurveyKey,
  type: SurveyDisplayType
): Promise<boolean> => {
  const value = await storage.readString(getStorageKey(venueSurvey, type))
  return value === 'true'
}

export const markVenueSurveyAccess = (venueSurvey: VenueSurveyKey, type: SurveyDisplayType) =>
  storage.saveString(getStorageKey(venueSurvey, type), 'true')
