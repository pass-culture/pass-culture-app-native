import { Position } from 'libs/location/types'
import { AI_SURVEY_URL } from 'shared/AIFakeDoorModal/AIFakeDoorModal'
import { buildAISurveyURL } from 'shared/AIFakeDoorModal/buildAISurveyURL'

jest.mock('libs/firebase/analytics/analytics')

describe('buildAISurveyURL', () => {
  const mockLocation: Position = {
    latitude: 48.8566,
    longitude: 2.3522,
  }

  it('should return the base URL when no parameters are provided', () => {
    const url = buildAISurveyURL(null)

    expect(url).toEqual(AI_SURVEY_URL)
  })

  it('should include only location parameters when userCity is missing', () => {
    const url = buildAISurveyURL(mockLocation, null)

    expect(url).toEqual(`${AI_SURVEY_URL}?latitude=48.8566&longitude=2.3522`)
  })

  it('should include only city parameter when location is missing', () => {
    const url = buildAISurveyURL(null, 'Paris')

    expect(url).toEqual(`${AI_SURVEY_URL}?city=Paris`)
  })

  it('should include all parameters when both location and city are provided', () => {
    const url = buildAISurveyURL(mockLocation, 'Marseille')

    expect(url).toEqual(`${AI_SURVEY_URL}?latitude=48.8566&longitude=2.3522&city=Marseille`)
  })

  it('should correctly encode special characters in the city name', () => {
    const cityWithSpecialChars = 'Saint-Étienne 92'
    const url = buildAISurveyURL(null, cityWithSpecialChars)

    expect(url).toEqual(`${AI_SURVEY_URL}?city=Saint-%C3%89tienne+92`)
  })
})
