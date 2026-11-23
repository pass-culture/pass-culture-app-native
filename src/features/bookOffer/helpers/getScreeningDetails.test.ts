import { ScreeningFeatures } from 'api/gen'
import { getScreeningDetails } from 'features/bookOffer/helpers/getScreeningDetails'

const screeningFeatures = (features: Partial<ScreeningFeatures> = {}): ScreeningFeatures => ({
  accessibility: { audio: [], mental: [], motor: [], visual: [] },
  audio: null,
  language: null,
  specialEventType: null,
  video: null,
  ...features,
})

describe('getScreeningDetails', () => {
  it('should map stock screening features to details in display order', () => {
    expect(
      getScreeningDetails(
        screeningFeatures({
          accessibility: {
            audio: [],
            mental: ['RELAX'],
            motor: ['PMR'],
            visual: [],
          },
          language: 'VF',
          specialEventType: 'AVANT_PREMIERE',
          video: 'SCREEN_X',
        })
      )
    ).toEqual([
      {
        type: 'tag',
        category: 'special-event',
        label: 'Avant-première',
        description: 'Le film est projeté avant sa sortie officielle en salles.',
      },
      {
        type: 'tag',
        category: 'video',
        label: 'ScreenX',
        description:
          'Le film est projeté sur l’écran et sur les murs de gauche et de droite. Seules certaines scènes s’étendent sur les murs.',
      },
      {
        type: 'accessibility',
        category: 'mental',
        label: 'Ciné Relax',
        description:
          'Séance au son modéré et à la lumière douce, où chacun peut bouger et réagir librement. Pensée pour les personnes en situation de handicap, ouverte à tout le monde.',
      },
      {
        type: 'accessibility',
        category: 'motor',
        label: 'Accès PMR',
        description: 'Salle accessible en fauteuil roulant, avec des places réservées.',
      },
    ])
  })

  it('should keep several accessibility values for the same handicap', () => {
    expect(
      getScreeningDetails(
        screeningFeatures({
          audio: 'ATMOS',
          accessibility: {
            audio: ['AUDIO_HI', 'SUBTITLE_CCAP'],
            mental: [],
            motor: [],
            visual: ['AD_GRETA', 'AUDIO_DESCRIPTION'],
          },
        })
      ).map(({ category, label }) => ({ category, label }))
    ).toEqual([
      { category: 'audio', label: 'Dolby Atmos' },
      { category: 'visual', label: 'Audio description Greta' },
      { category: 'visual', label: 'Audio Description' },
      { category: 'audio', label: 'Ecoute Assistée' },
      { category: 'audio', label: 'Sous-titré CCAP' },
    ])
  })

  it('should ignore unknown features and language', () => {
    expect(
      getScreeningDetails(
        screeningFeatures({
          language: 'VF',
          audio: 'UNKNOWN',
          specialEventType: 'UNKNOWN',
          video: 'UNKNOWN',
        })
      )
    ).toEqual([])
    expect(getScreeningDetails()).toEqual([])
  })
})
