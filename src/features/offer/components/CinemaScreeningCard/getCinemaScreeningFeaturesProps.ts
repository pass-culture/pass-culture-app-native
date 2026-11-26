import { ScreeningFeatures } from 'api/gen'
import { AUDIO, EVENT, VIDEO } from 'features/offer/components/OfferCine/screeningFeatureDetails'

const getFeatureName = (value: string | null, details: Record<string, { name: string }>) =>
  value ? details[value]?.name : undefined

export const getCinemaScreeningFeaturesProps = (features: ScreeningFeatures) => {
  const video = getFeatureName(features.video, VIDEO)
  const audio = getFeatureName(features.audio, AUDIO)

  return {
    languages: features.language ? [features.language] : [],
    specialEvent: getFeatureName(features.specialEventType, EVENT),
    video: video ? [video] : [],
    audio: audio ? [audio] : [],
    accessibility: features.accessibility,
  }
}
