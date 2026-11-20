import { getScreeningDetails } from 'features/offer/components/OfferCine/getScreeningDetails'

describe('getScreeningDetails', () => {
  it('should map stock features to details in display order', () => {
    expect(
      getScreeningDetails([
        'VF',
        'DOLBY_ATMOS',
        'SCREEN_X',
        'CCAP',
        'RELAX',
        'PMR',
        'GRETA',
        'PREVIEW_SCREENING',
      ])
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
        type: 'tag',
        category: 'audio',
        label: 'Dolby Atmos',
        description: 'Le son vient de tous les côtés de la salle, y compris du plafond.',
      },
      {
        type: 'accessibility',
        category: 'visual',
        label: 'Audio description Greta',
        description: 'Audio Description, disponible avec l’application Greta.',
      },
      {
        type: 'accessibility',
        category: 'audio',
        label: 'Sous-titré CCAP',
        description:
          'Sous-titres pour personnes sourdes ou malentendantes, affichés sur un petit écran individuel ou des lunettes fournis par le cinéma.',
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
      getScreeningDetails(['AUDIO_HI', 'SUBTITLE_CCAP', 'AD_GRETA', 'AUDIO_DESCRIPTION']).map(
        ({ category, label }) => ({ category, label })
      )
    ).toEqual([
      { category: 'visual', label: 'Audio description Greta' },
      { category: 'visual', label: 'Audio Description' },
      { category: 'audio', label: 'Ecoute Assistée' },
      { category: 'audio', label: 'Sous-titré CCAP' },
    ])
  })

  it('should ignore unknown features and language', () => {
    expect(getScreeningDetails(['VF', 'VO', 'UNKNOWN'])).toEqual([])
  })
})
