import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'

// Mapping from contentful label to corresponding search group
const CONTENTFUL_LABELS: Record<string, SearchGroupNameEnum> = {
  ['Cinéma']: SearchGroupNameEnum.CINEMA,
  ['Conférences, rencontres']: SearchGroupNameEnum.CONFERENCE,
  ['Cours, ateliers']: SearchGroupNameEnum.COURS,
  ['Films, séries, podcasts']: SearchGroupNameEnum.FILM,
  ['Instruments de musique']: SearchGroupNameEnum.INSTRUMENT,
  ['Jeux vidéos']: SearchGroupNameEnum.JEU,
  ['Livres']: SearchGroupNameEnum.LIVRE,
  ['Matériel arts créatifs']: SearchGroupNameEnum.MATERIEL,
  ['Musique']: SearchGroupNameEnum.MUSIQUE,
  ['Presse']: SearchGroupNameEnum.PRESSE,
  ['Spectacles']: SearchGroupNameEnum.SPECTACLE,
  ['Visites, expositions']: SearchGroupNameEnum.VISITE,
}

export const getCategoriesFacetFilters = (categoryLabel: string): SearchGroupNameEnum => {
  const searchGroup = categoryLabel in CONTENTFUL_LABELS ? CONTENTFUL_LABELS[categoryLabel] : null
  return searchGroup ? CATEGORY_CRITERIA[searchGroup].facetFilter : SearchGroupNameEnum.NONE
}
