import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'

// Mapping from contentful label to corresponding search group
const CONTENTFUL_LABELS: Record<string, SearchGroupNameEnumv2> = {
  ['Arts & loisirs créatifs']: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
  ['Bibliothèques, Médiathèques']: SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
  ['Cartes jeunes']: SearchGroupNameEnumv2.CARTES_JEUNES,
  ['CD, vinyles, musique en ligne']: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
  ['Concerts & festivals']: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
  ['Conférences & rencontres']: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
  ['Évènements en ligne']: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
  ['Films, séries, cinéma']: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
  ['Instruments de musique']: SearchGroupNameEnumv2.INSTRUMENTS,
  ['Jeux & jeux vidéos']: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
  ['Livres']: SearchGroupNameEnumv2.LIVRES,
  ['Médias & presse']: SearchGroupNameEnumv2.MEDIA_PRESSE,
  ['Musées & visites culturelles']: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
  ['Spectacles']: SearchGroupNameEnumv2.SPECTACLES,
}

export const getCategoriesFacetFilters = (categoryLabel: string): SearchGroupNameEnumv2 => {
  const searchGroup = categoryLabel in CONTENTFUL_LABELS ? CONTENTFUL_LABELS[categoryLabel] : null
  return searchGroup ? CATEGORY_CRITERIA[searchGroup].facetFilter : SearchGroupNameEnumv2.NONE
}
