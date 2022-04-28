import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { mockedCulturalSurveyQuestions } from 'features/culturalSurvey/fixtures/mockedCulturalSurveyQuestions'
import { createInitialQuestionsList } from 'features/culturalSurvey/helpers/utils'

describe('createInitialQuestionsList', () => {
  it('should return list of questions id', () => {
    const ids = createInitialQuestionsList(mockedCulturalSurveyQuestions)
    expect(ids).toEqual([CulturalSurveyQuestionEnum.SORTIES, CulturalSurveyQuestionEnum.ACTIVITES])
  })

  it('should return empty list if no data provided', () => {
    const ids = createInitialQuestionsList()
    expect(ids).toEqual([])
  })
})
