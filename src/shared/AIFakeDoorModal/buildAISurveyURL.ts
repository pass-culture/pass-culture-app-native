import { Position } from 'libs/location/types'
import { AI_SURVEY_URL } from 'shared/AIFakeDoorModal/AIFakeDoorModal'

export const buildAISurveyURL = (userLocation: Position, userCity?: string | null) => {
  const params = new URLSearchParams()

  if (userLocation) {
    params.append('latitude', String(userLocation.latitude))
    params.append('longitude', String(userLocation.longitude))
  }

  if (userCity) {
    params.append('city', userCity)
  }

  const queryString = params.toString()
  return queryString ? `${AI_SURVEY_URL}?${queryString}` : AI_SURVEY_URL
}
