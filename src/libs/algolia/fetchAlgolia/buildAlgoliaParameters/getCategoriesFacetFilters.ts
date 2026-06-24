import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { ContentfulLabelCategories } from 'libs/contentful/types'

// Mapping from contentful label to corresponding search group
const CONTENTFUL_LABELS = {
  //TODO(PC-42568): delete this line after next forced app version bump
  ['Arts & loisirs créatifs']: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
  ['Cartes jeunes']: SearchGroupNameEnumv2.CARTES_JEUNES,
  ['CD, vinyles, musique en ligne']: SearchGroupNameEnumv2.MUSIQUE,
  ['Cinéma']: SearchGroupNameEnumv2.CINEMA,
  //TODO(PC-42568): delete this line after next forced app version bump
  ['Concerts & festivals']: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
  //TODO(PC-42568): delete this line after next forced app version bump
  ['Conférences & rencontres']: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
  ['Évènements en ligne']: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
  ['Films, documentaires et séries']: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
  ['Instruments de musique']: SearchGroupNameEnumv2.MUSIQUE,
  //TODO(PC-42568): delete this line after next forced app version bump
  ['Jeux & jeux vidéos']: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
  ['Livres']: SearchGroupNameEnumv2.LIVRES,
  //TODO(PC-42568): delete this line after next forced app version bump
  ['Médias & presse']: SearchGroupNameEnumv2.MEDIA_PRESSE,
  //TODO(PC-42568): delete this line after next forced app version bump
  ['Musées & visites culturelles']: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
  ['Musique']: SearchGroupNameEnumv2.MUSIQUE,
  ['Spectacles']: SearchGroupNameEnumv2.SPECTACLES,
  ['Arts et loisirs créatifs']: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
  ['Concerts et festivals']: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
  ['Conférences et rencontres']: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
  ['Jeux et jeux vidéos']: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
  ['Médias et presse']: SearchGroupNameEnumv2.MEDIA_PRESSE,
  ['Musées et visites']: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
} as const satisfies Record<ContentfulLabelCategories, SearchGroupNameEnumv2>

export const getCategoriesFacetFilters = (
  categoryLabel: ContentfulLabelCategories
): SearchGroupNameEnumv2 => {
  const searchGroup = CONTENTFUL_LABELS[categoryLabel]

  return CATEGORY_CRITERIA[searchGroup]?.facetFilter ?? SearchGroupNameEnumv2.NONE
}
