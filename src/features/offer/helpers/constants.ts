import { SearchGroupNameEnumv2 } from 'api/gen'

export const EXCLUDED_ARTISTS = ['collectif', 'collectifs']

export const FAKE_DOOR_ARTIST_SEARCH_GROUPS = [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]

export const DEFAULT_SURVEY_MODAL_DATA = {
  title: 'Encore un peu de patience…',
  description: 'Cette action n’est pas encore disponible, mais elle le sera bientôt\u00a0!',
  surveyURL: '',
}

export const ARTIST_SURVEY_MODAL_DATA = {
  title: 'Encore un peu de patience…',
  description:
    'Ce contenu n’est pas encore disponible.\n\nAide-nous à le mettre en place en répondant au questionnaire.',
  surveyURL: 'https://passculture.qualtrics.com/jfe/form/SV_6xRze4sgvlbHNd4',
}

export const COMMA_OR_SEMICOLON_REGEX = /[,;]/
