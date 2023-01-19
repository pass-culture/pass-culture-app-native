import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { culturalSurveyQuestionsFixture } from 'features/culturalSurvey/fixtures/culturalSurveyQuestions.fixture'
import { createInitialQuestionsList } from 'features/culturalSurvey/helpers/createInitialQuestionsList'

describe('createInitialQuestionsList', () => {
  it('should return list of questions id', () => {
    const ids = createInitialQuestionsList(culturalSurveyQuestionsFixture)
    expect(ids).toEqual([CulturalSurveyQuestionEnum.SORTIES, CulturalSurveyQuestionEnum.ACTIVITES])
  })

  it('should return empty list if no data provided', () => {
    const ids = createInitialQuestionsList()
    expect(ids).toEqual([])
  })
})
