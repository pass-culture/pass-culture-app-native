import {
  BookType,
  GenreType,
  GTL,
  NativeCategoryResponseModelv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { ALL_CATEGORIES_LABEL } from 'features/search/constants'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { availableCategories } from 'features/search/helpers/availableCategories/availableCategories'
import { getNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { OfferGenreType } from 'features/search/types'

export type BaseCategory = {
  label: string
  position?: number
}
type MappedGenreType = BaseCategory & {
  gtls?: GTL[]
}
export type MappedGenreTypes = Record<string, MappedGenreType>
type MappedNativeCategory = BaseCategory & {
  genreTypeKey?: GenreType
  children?: MappedGenreTypes
  gtls?: GTL[]
}
export type MappedNativeCategories = Record<string, MappedNativeCategory>
type MappedCategory = BaseCategory & {
  children: MappedNativeCategories
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
    children: genreType.values.reduce<MappedGenreTypes>((res, genre) => {
      res[genre.name] = { label: genre.value }
      return res
    }, {}),
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

  return bookTree.flatMap((bookCategory) =>
    bookCategory.children.map((bookGenre) => {
      return {
        name: getKeyFromStringLabel(bookGenre.label),
        value: bookGenre.label,
        key: GenreType.BOOK,
      } as OfferGenreType
    })
  )
}

function mapBookCategories(data: SubcategoriesResponseModelv2) {
  /* 
  Here we make fake native categories out of the book genres
  The purpose is to be able to display them at the native category level in the `CategoriesModal`.
  */
  const bookTree = data.genreTypes.find(({ name }) => name === GenreType.BOOK)?.trees as BookType[]

  return bookTree.reduce<MappedNativeCategories>((genresMapping, bookGenre) => {
    const genreKey = getKeyFromStringLabel(bookGenre.label)
    if (!genreKey) return genresMapping

    genresMapping[genreKey] = {
      ...bookGenre,
      genreTypeKey: GenreType.BOOK,
      children: bookGenre.children.reduce<MappedGenreTypes>((childrenMapping, child) => {
        const childKey = getKeyFromStringLabel(child.label)
        if (childKey) childrenMapping[childKey] = child
        return childrenMapping
      }, {}),
    }
    return genresMapping
  }, {})
}

export function createMappingTree(data: SubcategoriesResponseModelv2) {
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

  return data.searchGroups
    .filter(
      (searchGroup) =>
        searchGroup.name in availableCategories && searchGroup.name in CATEGORY_CRITERIA
    )
    .sort((a, b) => {
      const positionA: number = CATEGORY_CRITERIA[a.name]?.position ?? 0
      const positionB: number = CATEGORY_CRITERIA[b.name]?.position ?? 0
      return positionA - positionB
    })
    .reduce<MappingTree>((result, searchGroup) => {
      const nativeCategories = getNativeCategories(data, searchGroup.name)
      const mappedNativeCategories = nativeCategories.length
        ? nativeCategories.reduce<MappedNativeCategories>(
            (nativeCategoriesResult, nativeCategory) => {
              nativeCategoriesResult[nativeCategory.name] = {
                label: nativeCategory.value ?? 'Tout',
                position: nativeCategory.positions?.[searchGroup.name],
                ...(getNativeCategoryGenreTypes(data, nativeCategory) || {}),
              }

              return nativeCategoriesResult
            },
            {}
          )
        : {}

      result[searchGroup.name] = {
        label: searchGroup.value || ALL_CATEGORIES_LABEL,
        children:
          searchGroup.name === SearchGroupNameEnumv2.LIVRES
            ? {
                ...mappedNativeCategories,
                ...mapBookCategories(data),
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
    .replaceAll('&', 'ET')
    .replaceAll('-', '_')
    .replaceAll(',', '')
    .replace(/ /g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
