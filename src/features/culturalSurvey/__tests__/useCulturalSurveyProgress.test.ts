import { CulturalSurveyQuestionEnum } from 'api/gen'
import * as CulturalSurveyContextProviderModule from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { useCulturalSurveyProgress } from 'features/culturalSurvey/useCulturalSurveyProgress'
import { renderHook } from 'tests/utils'

import { ICulturalSurveyContext } from '../context/CulturalSurveyContextProvider'

jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

const dispatch = jest.fn()

function mockCulturalSurveyContextProviderWithQuestionsToDisplay(
  questionsToDisplay: CulturalSurveyQuestionEnum[]
) {
  return jest
    .spyOn(CulturalSurveyContextProviderModule, 'useCulturalSurveyContext')
    .mockImplementation(
      () =>
        ({
          dispatch,
          questionsToDisplay,
        } as unknown as ICulturalSurveyContext)
    )
}

describe('useCulturalSurveyProgress', () => {
  it('should be zero on init', () => {
    mockCulturalSurveyContextProviderWithQuestionsToDisplay([
      CulturalSurveyQuestionEnum.SORTIES,
      CulturalSurveyQuestionEnum.ACTIVITES,
    ])
    const {
      result: { current: progression },
    } = renderHook(() => useCulturalSurveyProgress(CulturalSurveyQuestionEnum.SORTIES))
    expect(progression).toEqual(0)
  })

  it('should be 0.33 with 3 questions and step 1', () => {
    mockCulturalSurveyContextProviderWithQuestionsToDisplay([
      CulturalSurveyQuestionEnum.ACTIVITES,
      CulturalSurveyQuestionEnum.SORTIES,
      CulturalSurveyQuestionEnum.FESTIVALS,
    ])
    const {
      result: { current: progression },
    } = renderHook(() => useCulturalSurveyProgress(CulturalSurveyQuestionEnum.SORTIES))
    expect(progression).toEqual(0.33)
  })

  it('should be 0.66 with 3 questions and step 2', () => {
    mockCulturalSurveyContextProviderWithQuestionsToDisplay([
      CulturalSurveyQuestionEnum.ACTIVITES,
      CulturalSurveyQuestionEnum.SORTIES,
      CulturalSurveyQuestionEnum.FESTIVALS,
    ])
    const {
      result: { current: progression },
    } = renderHook(() => useCulturalSurveyProgress(CulturalSurveyQuestionEnum.FESTIVALS))
    expect(progression).toEqual(0.66)
  })

  it('should be 0 with 4 questions and step 0', () => {
    mockCulturalSurveyContextProviderWithQuestionsToDisplay([
      CulturalSurveyQuestionEnum.ACTIVITES,
      CulturalSurveyQuestionEnum.SORTIES,
      CulturalSurveyQuestionEnum.FESTIVALS,
      CulturalSurveyQuestionEnum.SPECTACLES,
    ])
    const {
      result: { current: progression },
    } = renderHook(() => useCulturalSurveyProgress(CulturalSurveyQuestionEnum.ACTIVITES))
    expect(progression).toEqual(0)
  })

  it('should be 0.25 with 4 questions and step 1', () => {
    mockCulturalSurveyContextProviderWithQuestionsToDisplay([
      CulturalSurveyQuestionEnum.ACTIVITES,
      CulturalSurveyQuestionEnum.SORTIES,
      CulturalSurveyQuestionEnum.FESTIVALS,
      CulturalSurveyQuestionEnum.SPECTACLES,
    ])
    const {
      result: { current: progression },
    } = renderHook(() => useCulturalSurveyProgress(CulturalSurveyQuestionEnum.SORTIES))
    expect(progression).toEqual(0.25)
  })

  it('should be 0.5 with 4 questions and step 2', () => {
    mockCulturalSurveyContextProviderWithQuestionsToDisplay([
      CulturalSurveyQuestionEnum.ACTIVITES,
      CulturalSurveyQuestionEnum.SORTIES,
      CulturalSurveyQuestionEnum.FESTIVALS,
      CulturalSurveyQuestionEnum.SPECTACLES,
    ])
    const {
      result: { current: progression },
    } = renderHook(() => useCulturalSurveyProgress(CulturalSurveyQuestionEnum.FESTIVALS))
    expect(progression).toEqual(0.5)
  })

  it('should be 0.25 with 4 questions and step 3', () => {
    mockCulturalSurveyContextProviderWithQuestionsToDisplay([
      CulturalSurveyQuestionEnum.ACTIVITES,
      CulturalSurveyQuestionEnum.SORTIES,
      CulturalSurveyQuestionEnum.FESTIVALS,
      CulturalSurveyQuestionEnum.SPECTACLES,
    ])
    const {
      result: { current: progression },
    } = renderHook(() => useCulturalSurveyProgress(CulturalSurveyQuestionEnum.SPECTACLES))
    expect(progression).toEqual(0.75)
  })
})
