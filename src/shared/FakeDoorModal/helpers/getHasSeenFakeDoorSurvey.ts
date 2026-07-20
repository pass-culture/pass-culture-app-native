import { storage, StorageKey } from 'libs/storage'

export const getHasSeenFakeDoorSurvey = async (surveyKey: StorageKey): Promise<boolean> =>
  (await storage.readString(surveyKey)) === 'true'
