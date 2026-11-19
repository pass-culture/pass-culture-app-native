import { selectCinemaScreeningDetails } from 'features/bookings/queries/selectors/selectCinemaScreeningDetails'

describe('selectCinemaScreeningDetails', () => {
  it('should adapt screening features to the modal details in display order', () => {
    expect(
      selectCinemaScreeningDetails({
        language: 'VF',
        video: 'IMAX',
        audio: 'DOLBY_ATMOS',
        accessibility: {
          motor: ['PMR'],
          audio: ['CCAP'],
          visual: ['GRETA'],
          mental: [],
        },
        specialEventType: 'PREVIEW_SCREENING_WITH_CREW',
      })
    ).toEqual([
      {
        type: 'tag',
        category: 'special-event',
        label: 'Avant première',
        description:
          'Séance exceptionnelle permettant de découvrir un film en exclusivité, avant sa sortie officielle.',
      },
      {
        type: 'tag',
        category: 'video',
        label: 'IMAX',
        description:
          'Projection en avant-première suivie d’une rencontre exceptionnelle avec le réalisateur et les acteurs.',
      },
      {
        type: 'tag',
        category: 'audio',
        label: 'DolbyAtmos',
        description:
          'Expérience cinéma immersive, avec une image plus grande, un son puissant et des détails exceptionnels.',
      },
      {
        type: 'accessibility',
        category: 'visual',
        label: 'Audio-description GRETA',
        description:
          'Audio-description est un service qui décrit à voix haute les images et actions à l’écran pour les personnes malvoyantes.',
      },
      {
        type: 'accessibility',
        category: 'audio',
        label: 'Sous-titrage CCAP',
        description:
          'Dispositifs pour malentendants permet de mieux entendre les dialogues et les sons du film grâce à un système adapté.',
      },
      {
        type: 'accessibility',
        category: 'motor',
        label: 'Accès PMR',
        description:
          'Dispositifs d’accès handicap sont des aménagements et équipements adaptés pour faciliter l’accès au cinéma et le confort de tous.',
      },
    ])
  })

  it('should return an empty list without supported screening features', () => {
    expect(
      selectCinemaScreeningDetails({
        language: 'VF',
        video: 'UNKNOWN_VIDEO',
        audio: null,
        accessibility: {
          audio: ['UNKNOWN_ACCESSIBILITY'],
          mental: [],
          motor: [],
          visual: [],
        },
        specialEventType: null,
      })
    ).toEqual([])
  })
})
