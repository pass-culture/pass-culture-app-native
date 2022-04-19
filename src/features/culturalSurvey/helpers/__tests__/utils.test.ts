import { mockCulturalSurveyQuestions } from 'features/culturalSurvey/fixtures/culturalSurveyQuestions'
import { createInitialQuestionsList } from 'features/culturalSurvey/helpers/utils'

describe('createInitialQuestionsList', () => {
  it('should return list of questions id', () => {
    const ids = createInitialQuestionsList(mockCulturalSurveyQuestions)
    expect(ids).toEqual(['SORTIES', 'ACTIVITES'])
  })

  it('should return empty list if no data provided', () => {
    const ids = createInitialQuestionsList()
    expect(ids).toEqual([])
  })
})
