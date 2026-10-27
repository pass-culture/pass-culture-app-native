import { ScreeningFeatures } from 'api/gen'

const SPECIAL_EVENT_LABELS: Partial<Record<string, string>> = {
  PREVIEW_SCREENING_WITH_CREW: 'Avant première',
}

const VIDEO_LABELS: Partial<Record<string, string>> = {
  IMAX: 'IMAX',
}

const AUDIO_LABELS: Partial<Record<string, string>> = {
  DOLBY_ATMOS: 'DolbyAtmos',
}

const getFeatureLabel = (value: string | null, labels: Partial<Record<string, string>>) =>
  value ? labels[value] : undefined

export const getCinemaScreeningFeaturesProps = (features: ScreeningFeatures) => {
  const video = getFeatureLabel(features.video, VIDEO_LABELS)
  const audio = getFeatureLabel(features.audio, AUDIO_LABELS)

  return {
    languages: features.language ? [features.language] : [],
    specialEvent: getFeatureLabel(features.specialEventType, SPECIAL_EVENT_LABELS),
    video: video ? [video] : [],
    audio: audio ? [audio] : [],
    accessibility: features.accessibility,
  }
}
