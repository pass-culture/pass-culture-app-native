import {
  BookType,
  GenreType,
  GTL,
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { getNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { OfferGenreType } from 'features/search/types'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { FacetData, NativeCategoryFacetData } from 'libs/algolia/types'

type MappedGenreType = {
  label: string
  nbResultsFacet?: never
  gtls?: GTL[]
  position?: number
}
export type MappedGenreTypes = Record<string, MappedGenreType>
type MappedNativeCategory = {
  label: string
  nbResultsFacet?: number
  genreTypeKey?: GenreType
  children?: MappedGenreTypes
  gtls?: GTL[]
}
export type MappedNativeCategories = Record<string, MappedNativeCategory>
type MappedCategory = {
  label: string
  children?: MappedNativeCategories
}
export type MappingTree = Record<SearchGroupNameEnumv2, MappedCategory>

function getNativeCategoryGenreTypes(
  data: SubcategoriesResponseModelv2,
  nativeCategory: NativeCategoryResponseModelv2
): Omit<MappedNativeCategory, 'label'> | undefined {
  const genreType = data.genreTypes.find((genreType) => genreType.name === nativeCategory.genreType)
  if (!genreType) return undefined

  return {
    genreTypeKey: genreType.name,
    children: genreType.values.reduce<MappedGenreTypes>((res, genreTypeValue) => {
      res[genreTypeValue.name] = {
        label: genreTypeValue.value,
      }

      return res
    }, {} as MappedGenreTypes),
  }
}

export function getBooksNativeCategories(data: SubcategoriesResponseModelv2) {
  const bookTree = data.genreTypes.find(({ name }) => name === GenreType.BOOK)?.trees as BookType[]

  return bookTree.map((bookCategory) => {
    const categoryName = getKeyFromStringLabel(bookCategory.label)
    return { name: categoryName, value: bookCategory.label, genreType: GenreType.BOOK }
  })
}

export function getBooksGenreTypes(data: SubcategoriesResponseModelv2): OfferGenreType[] {
  const bookTree = data.genreTypes.find(({ name }) => name === GenreType.BOOK)?.trees as BookType[]

  return bookTree
    .map((bookCategory) =>
      bookCategory.children.map((bookGenre) => {
        return {
          name: getKeyFromStringLabel(bookGenre.label),
          value: bookGenre.label,
          key: GenreType.BOOK,
        } as OfferGenreType
      })
    )
    .flat()
}

function mapBookCategories(data: SubcategoriesResponseModelv2) {
  const bookTree = data.genreTypes.find(({ name }) => name === GenreType.BOOK)?.trees as BookType[]
  bookTree.sort(({ position: positionA }, { position: positionB }) => positionA - positionB)

  return bookTree.reduce<MappedNativeCategories>((nativeCategoriesResult, nativeCategory) => {
    const categorieKey = getKeyFromStringLabel(nativeCategory.label)
    nativeCategory.children.sort(
      ({ position: positionA }, { position: positionB }) => positionA - positionB
    )
    if (categorieKey) {
      nativeCategoriesResult[categorieKey as NativeCategoryIdEnumv2] = {
        label: nativeCategory.label,
        nbResultsFacet: 0,
        genreTypeKey: GenreType.BOOK,
        gtls: nativeCategory.gtls,
        children: nativeCategory.children.reduce<MappedGenreTypes>(
          (genreTypeChildren, genreType) => {
            const genreKey = getKeyFromStringLabel(genreType.label)
            if (genreKey) {
              genreTypeChildren[genreKey] = {
                label: genreType.label,
                gtls: genreType.gtls,
                position: genreType.position,
              }
              return genreTypeChildren
            }
            return {}
          },
          {} as MappedGenreTypes
        ),
      }
    }
    return nativeCategoriesResult
  }, {} as MappedNativeCategories)
}

export function createMappingTree(data?: SubcategoriesResponseModelv2, facetsData?: FacetData) {
  /**
   * We want to create a mapping tree that looks like this:
   * {
   *   'SearchGroup': {
   *     label: 'Tout',
   *     children: {
   *       'NativeCategoryOne': {
   *         label: 'Tout',
   *       },
   *       'NativeCategoryTwo': {
   *         label: 'Évènement',
   *         genreTypeKey: 'EventType',
   *         children: {
   *           'GenreType': {
   *             label: 'Cinéma',
   *           },
   *         }
   *       },
   *     }
   *   }
   * }
   */

  if (!data) return {} as MappingTree

  return data.searchGroups
    .filter(
      (searchGroup) =>
        searchGroup.name !== SearchGroupNameEnumv2.NONE &&
        Object.keys(CATEGORY_CRITERIA).includes(searchGroup.name)
    )
    .sort((a, b) => {
      const positionA: number = CATEGORY_CRITERIA[a.name]?.position || 0
      const positionB: number = CATEGORY_CRITERIA[b.name]?.position || 0
      return positionA - positionB
    })
    .reduce<MappingTree>((result, searchGroup) => {
      let mappedNativeCategories: MappedNativeCategories | undefined = undefined
      let mappedNativeCategoriesBooks: MappedNativeCategories | undefined = undefined

      if (searchGroup.name === SearchGroupNameEnumv2.LIVRES) {
        mappedNativeCategoriesBooks = mapBookCategories(data)
      }
      const nativeCategories = getNativeCategories(data, searchGroup.name).filter(
        (nativeCategory) => nativeCategory.name !== NativeCategoryIdEnumv2.CARTES_JEUNES
      )

      mappedNativeCategories = nativeCategories.length
        ? nativeCategories.reduce<MappedNativeCategories>(
            (nativeCategoriesResult, nativeCategory) => {
              nativeCategoriesResult[nativeCategory.name] = {
                label: nativeCategory.value ?? 'Tout',
                nbResultsFacet:
                  (facetsData as NativeCategoryFacetData)?.[
                    FACETS_FILTERS_ENUM.OFFER_NATIVE_CATEGORY
                  ]?.[nativeCategory.name] ?? 0,
                ...(getNativeCategoryGenreTypes(data, nativeCategory) || {}),
              }

              return nativeCategoriesResult
            },
            {} as MappedNativeCategories
          )
        : undefined

      result[searchGroup.name] = {
        label: searchGroup.value || 'Toutes les catégories',
        children: mappedNativeCategoriesBooks
          ? {
              ...mappedNativeCategories,
              ...mappedNativeCategoriesBooks,
            }
          : mappedNativeCategories,
      }

      return Object.entries(result).reduce((res, [key, value]) => {
        res[key as SearchGroupNameEnumv2] = value
        return res
      }, {} as MappingTree)
    }, {} as MappingTree)
}

export function getKeyFromStringLabel(input?: string | null): string | null {
  if (!input) return null
  return input
    .toUpperCase()
    .replace('&', 'ET')
    .replace('-', '_')
    .replace(',', '')
    .replace(/ /g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
