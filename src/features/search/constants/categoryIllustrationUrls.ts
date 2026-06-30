import { SearchGroupNameEnumv2 } from 'api/gen'
import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

export const categoryIllustrationUrls = {
  [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: buildCategoryIllustrationUrl(
    'paintingPalette%403x.png'
  ),
  [SearchGroupNameEnumv2.CARTES_JEUNES]: buildCategoryIllustrationUrl('passCard%403x.png'),
  [SearchGroupNameEnumv2.CINEMA]: buildCategoryIllustrationUrl('camera%403x.png'),
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: buildCategoryIllustrationUrl('mic%403x.png'),
  [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: buildCategoryIllustrationUrl('computer%403x.png'),
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]:
    buildCategoryIllustrationUrl('popcorn%403x.png'),
  [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: buildCategoryIllustrationUrl('videogame%403x.png'),
  [SearchGroupNameEnumv2.LIVRES]: buildCategoryIllustrationUrl('book%403x.png'),
  [SearchGroupNameEnumv2.MEDIA_PRESSE]: buildCategoryIllustrationUrl('newspaper%403x.png'),
  [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: buildCategoryIllustrationUrl('vase%403x.png'),
  [SearchGroupNameEnumv2.MUSIQUE]: buildCategoryIllustrationUrl('musicSheet%403x.png'),
  [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: buildCategoryIllustrationUrl('notebook%403x.png'),
  [SearchGroupNameEnumv2.SPECTACLES]: buildCategoryIllustrationUrl('spotlight%403x.png'),
} as const satisfies Partial<Record<SearchGroupNameEnumv2, string>>

export type CategoryIllustrationUrl =
  (typeof categoryIllustrationUrls)[keyof typeof categoryIllustrationUrls]
