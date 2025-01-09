import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { ALL_CATEGORIES_LABEL } from 'features/search/constants'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums/facetsEnums'

export type CategoryKey = NativeCategoryIdEnumv2 | SearchGroupNameEnumv2 | string

export type BaseCategory = {
  children: CategoryKey[]
  label: string
  key: CategoryKey
  position?: number
  searchFilter?: FACETS_FILTERS_ENUM
  searchValue?: string
  nbResultsFacet?: number
  showChildren?: boolean
}
export type CategoriesMapping = Record<CategoryKey, BaseCategory>
export type TopLevelCategory = BaseCategory & {
  key: Exclude<SearchGroupNameEnumv2, SearchGroupNameEnumv2.NONE>
}

export const ROOT_ALL: BaseCategory = {
  children: [],
  label: ALL_CATEGORIES_LABEL,
  key: 'NONE',
  position: -Infinity,
}
export const ALL: BaseCategory = {
  children: [],
  label: 'Tout',
  key: 'ALL',
  position: -Infinity,
}
export const ROOT: BaseCategory = {
  children: [],
  label: 'Catégories',
  key: 'ROOT',
  position: -Infinity,
}

export type CategoryResponseModel = {
  key: CategoryKey
  label: string
  position?: number
  children: CategoryKey[]
}

export const DEFAULT_CATEGORIES: BaseCategory[] = [
  {
    key: 'CINEMA',
    label: 'Cinéma',
    position: 2,
    children: ['SEANCE'],
    searchFilter: FACETS_FILTERS_ENUM.OFFER_SEARCH_GROUP_NAME,
    searchValue: 'CINEMA',
  },
  {
    key: 'LIVRES',
    label: 'Livres',
    position: 1,
    children: ['BIBLIOTHEQUE', 'LIVRES_PAPIER', 'LIVRES_AUDIO'],
    searchFilter: FACETS_FILTERS_ENUM.OFFER_SEARCH_GROUP_NAME,
    searchValue: 'LIVRES',
  },
  {
    key: 'LIVRES_PAPIER',
    label: 'Livres papier',
    position: 1,
    children: ['ROMANS_ET_LITTERATURE', 'MANGAS'],
    showChildren: true,
    searchFilter: FACETS_FILTERS_ENUM.OFFER_NATIVE_CATEGORY,
    searchValue: 'LIVRES_PAPIER',
  },
  {
    key: 'LIVRES_AUDIO',
    label: 'Livres audio',
    position: 2,
    children: [],
  },
  {
    key: 'BIBLIOTHEQUE',
    label: 'Bibliothèque',
    position: 3,
    children: [],
  },
  {
    key: 'ROMANS_ET_LITTERATURE',
    label: 'Romans et littérature',
    position: 1,
    children: ['ROMANCE'],
    searchFilter: FACETS_FILTERS_ENUM.OFFER_NATIVE_CATEGORY,
    searchValue: 'LIVRES_PAPIER',
  },
  {
    key: 'MANGAS',
    label: 'Mangas',
    position: 2,
    children: [],
  },
  {
    key: 'ROMANCE',
    label: 'Romance',
    position: 1,
    children: [],
  },
  { key: 'MUSIQUE', label: 'Musique', position: 3, children: ['SEANCE'] },
  { key: 'SEANCE', label: 'Séance de cinéma', position: 1, children: ['THRILLER'] },
  { key: 'THRILLER', label: 'Thriller', position: 1, children: [] },
]
