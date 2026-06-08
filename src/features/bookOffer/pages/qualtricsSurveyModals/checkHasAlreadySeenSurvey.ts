import { SourceType } from 'algoliasearch'

import { storage } from 'libs/storage'

type SurveyStatus = {
  confirm: boolean
  cancelled: boolean
}

type SurveyType = keyof SurveyStatus

export const checkHasAlreadySeenSurvey = async (
  showModal: () => void,
  isEvent: boolean,
  surveyType: SurveyType
) => {
  const surveyStatus = await storage.readObject<Record<SourceType, boolean>>(
    'has_seen_qualtrics_survey'
  )

  const hasAlreadySeenSurvey = !!surveyStatus?.[surveyType]

  if (!hasAlreadySeenSurvey && isEvent) {
    showModal()

    await storage.saveObject('has_seen_qualtrics_survey', {
      ...surveyStatus,
      [surveyType]: true,
    })
  }
}
