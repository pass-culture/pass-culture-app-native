import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'

// Mapping from contentful label to corresponding search group
const CONTENTFUL_LABELS: Record<string, SearchGroupNameEnum> = {
  ['Arts & loisirs créatifs']: SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS,
  ['Bibliothèques, Médiathèques']: SearchGroupNameEnum.BIBLIOTHEQUES_MEDIATHEQUE,
  ['Cartes jeunes']: SearchGroupNameEnum.CARTES_JEUNES,
  ['CD, vinyle, musique en ligne']: SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE,
  ['Concerts & festivals']: SearchGroupNameEnum.CONCERTS_FESTIVALS,
  ['Conférences & rencontres']: SearchGroupNameEnum.RENCONTRES_CONFERENCES,
  ['Événements en ligne']: SearchGroupNameEnum.EVENEMENTS_EN_LIGNE,
  ['Films, séries, cinéma']: SearchGroupNameEnum.FILMS_SERIES_CINEMA,
  ['Instruments de musique']: SearchGroupNameEnum.INSTRUMENTS,
  ['Jeux & jeux vidéos']: SearchGroupNameEnum.JEUX_JEUX_VIDEOS,
  ['Livres']: SearchGroupNameEnum.LIVRES,
  ['Médias & presse']: SearchGroupNameEnum.MEDIA_PRESSE,
  ['Musées & visites culturelles']: SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES,
  ['Plateformes en ligne']: SearchGroupNameEnum.PLATEFORMES_EN_LIGNE,
  ['Matériel arts créatifs']: SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS,
  ['Spectacles']: SearchGroupNameEnum.SPECTACLES,
}

export const getCategoriesFacetFilters = (categoryLabel: string): SearchGroupNameEnum => {
  const searchGroup = categoryLabel in CONTENTFUL_LABELS ? CONTENTFUL_LABELS[categoryLabel] : null
  return searchGroup ? CATEGORY_CRITERIA[searchGroup].facetFilter : SearchGroupNameEnum.NONE
}
