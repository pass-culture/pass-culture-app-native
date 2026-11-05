import { VenueSurveyKey } from 'features/venue/types'
import { storage, StorageKey } from 'libs/storage'

const getStorageKey = (venueSurvey: VenueSurveyKey): StorageKey => `${venueSurvey}_venue_survey`

export const checkVenueSurveyAccess = async (venueSurvey: VenueSurveyKey): Promise<boolean> => {
  const value = await storage.readString(getStorageKey(venueSurvey))
  return value === 'true'
}

export const markVenueSurveyAccess = async (venueSurvey: VenueSurveyKey) => {
  await storage.saveString(getStorageKey(venueSurvey), 'true')
}
