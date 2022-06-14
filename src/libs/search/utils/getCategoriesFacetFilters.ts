import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'

// Mapping from contentful label to corresponding search group
const CONTENTFUL_LABELS: Record<string, SearchGroupNameEnum> = {
  ['Cinéma']: SearchGroupNameEnum.FILMS_SERIES_CINEMA,
  ['Conférences, rencontres']: SearchGroupNameEnum.CONFERENCE,
  ['Cours, ateliers']: SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS,
  ['Films, séries, podcasts']: SearchGroupNameEnum.FILMS_SERIES_CINEMA,
  ['Instruments de musique']: SearchGroupNameEnum.INSTRUMENT,
  ['Jeux vidéos']: SearchGroupNameEnum.JEU,
  ['Livres']: SearchGroupNameEnum.LIVRE,
  ['Matériel arts créatifs']: SearchGroupNameEnum.MATERIEL,
  ['Musique']: SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE,
  ['Presse']: SearchGroupNameEnum.PRESSE,
  ['Spectacles']: SearchGroupNameEnum.CONCERTS_FESTIVALS,
  ['Visites, expositions']: SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES,
}

export const getCategoriesFacetFilters = (categoryLabel: string): SearchGroupNameEnum => {
  const searchGroup = categoryLabel in CONTENTFUL_LABELS ? CONTENTFUL_LABELS[categoryLabel] : null
  return searchGroup ? CATEGORY_CRITERIA[searchGroup].facetFilter : SearchGroupNameEnum.NONE
}
