import { SearchGroupNameEnumv2 } from 'api/gen'
import { categoryButtonIllustrationUrls } from 'shared/illustrations/categoryButtonIllustrations'

export const categoryIllustrationUrls = {
  [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: categoryButtonIllustrationUrls.PaintingPalette,
  [SearchGroupNameEnumv2.CARTES_JEUNES]: categoryButtonIllustrationUrls.PassCard,
  [SearchGroupNameEnumv2.CINEMA]: categoryButtonIllustrationUrls.Camera,
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: categoryButtonIllustrationUrls.Mic,
  [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: categoryButtonIllustrationUrls.Computer,
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: categoryButtonIllustrationUrls.Popcorn,
  [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: categoryButtonIllustrationUrls.Videogame,
  [SearchGroupNameEnumv2.LIVRES]: categoryButtonIllustrationUrls.Book,
  [SearchGroupNameEnumv2.MEDIA_PRESSE]: categoryButtonIllustrationUrls.Newspaper,
  [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: categoryButtonIllustrationUrls.Vase,
  [SearchGroupNameEnumv2.MUSIQUE]: categoryButtonIllustrationUrls.MusicSheet,
  [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: categoryButtonIllustrationUrls.Notebook,
  [SearchGroupNameEnumv2.SPECTACLES]: categoryButtonIllustrationUrls.Spotlight,
} as const satisfies Partial<Record<SearchGroupNameEnumv2, string>>

export type CategoryIllustrationUrl =
  (typeof categoryIllustrationUrls)[keyof typeof categoryIllustrationUrls]
