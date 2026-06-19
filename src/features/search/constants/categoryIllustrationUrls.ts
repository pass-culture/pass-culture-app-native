import { SearchGroupNameEnumv2 } from 'api/gen'
import { env } from 'libs/environment/env'

export const categoryIllustrationUrls = {
  [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: `${env.ILLUSTRATIONS_BASE_URL}/paintingPalette%403x.png`,
  [SearchGroupNameEnumv2.CARTES_JEUNES]: `${env.ILLUSTRATIONS_BASE_URL}/passCard%403x.png`,
  [SearchGroupNameEnumv2.CINEMA]: `${env.ILLUSTRATIONS_BASE_URL}/camera%403x.png`,
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: `${env.ILLUSTRATIONS_BASE_URL}/mic%403x.png`,
  [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: `${env.ILLUSTRATIONS_BASE_URL}/computer%403x.png`,
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: `${env.ILLUSTRATIONS_BASE_URL}/popcorn%403x.png`,
  [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: `${env.ILLUSTRATIONS_BASE_URL}/videogame%403x.png`,
  [SearchGroupNameEnumv2.LIVRES]: `${env.ILLUSTRATIONS_BASE_URL}/book%403x.png`,
  [SearchGroupNameEnumv2.MEDIA_PRESSE]: `${env.ILLUSTRATIONS_BASE_URL}/newspaper%403x.png`,
  [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: `${env.ILLUSTRATIONS_BASE_URL}/vase%403x.png`,
  [SearchGroupNameEnumv2.MUSIQUE]: `${env.ILLUSTRATIONS_BASE_URL}/musicSheet%403x.png`,
  [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: `${env.ILLUSTRATIONS_BASE_URL}/notebook%403x.png`,
  [SearchGroupNameEnumv2.SPECTACLES]: `${env.ILLUSTRATIONS_BASE_URL}/spotlight%403x.png`,
} satisfies Partial<Record<SearchGroupNameEnumv2, string>>
