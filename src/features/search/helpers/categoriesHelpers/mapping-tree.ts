import {
  GenreType,
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { getNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'

export type MappedGenreType = {
  label: string
}
export type MappedGenreTypes = Record<string, MappedGenreType>
export type MappedNativeCategory = {
  label: string
  genreTypeKey?: GenreType
  children?: MappedGenreTypes
}
export type MappedNativeCategories = Record<NativeCategoryIdEnumv2, MappedNativeCategory>
export type MappedCategory = {
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

export function createMappingTree(data?: SubcategoriesResponseModelv2) {
  if (!data) return {} as MappingTree

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
   *         label: 'Événement',
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
        searchGroup.name !== SearchGroupNameEnumv2.NONE &&
        Object.keys(CATEGORY_CRITERIA).includes(searchGroup.name)
    )
    .reduce<MappingTree>((result, searchGroup) => {
      const nativeCategories = getNativeCategories(data, searchGroup.name).filter(
        (nativeCategory) => nativeCategory.name !== NativeCategoryIdEnumv2.CARTES_JEUNES
      )

      const mappedNativeCategories = nativeCategories.reduce<MappedNativeCategories>(
        (nativeCategoriesResult, nativeCategory) => {
          nativeCategoriesResult[nativeCategory.name] = {
            label: nativeCategory.value ?? 'Tout',
            ...(getNativeCategoryGenreTypes(data, nativeCategory) || {}),
          }

          return nativeCategoriesResult
        },
        {} as MappedNativeCategories
      )

      result[searchGroup.name] = {
        label: searchGroup.value || 'Toutes les catégories',
        children: mappedNativeCategories,
      }

      /**
       * We want to sort the categories by label, and put 'Toutes les catégories' at the top
       */
      return Object.entries(result)
        .sort(([, aMap], [, bMap]) => {
          if (aMap.label === 'Toutes les catégories') return -1
          if (bMap.label === 'Toutes les catégories') return 1

          return aMap.label.localeCompare(bMap.label)
        })
        .reduce((res, [key, value]) => {
          res[key as SearchGroupNameEnumv2] = value
          return res
        }, {} as MappingTree)
    }, {} as MappingTree)
}
