import {
  GenreType,
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import {
  getFacetTypeFromGenreTypeKey,
  getNativeCategories,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'

type MappedGenreType = {
  label: string
  nbResultsFacet: number
}
export type MappedGenreTypes = Record<string, MappedGenreType>
type MappedNativeCategory = {
  label: string
  nbResultsFacet?: number
  genreTypeKey?: GenreType
  children?: MappedGenreTypes
}
export type MappedNativeCategories = Record<NativeCategoryIdEnumv2, MappedNativeCategory>
type MappedCategory = {
  label: string
  children?: MappedNativeCategories
}
export type MappingTree = Record<SearchGroupNameEnumv2, MappedCategory>

function getNativeCategoryGenreTypes(
  data: SubcategoriesResponseModelv2,
  nativeCategory: NativeCategoryResponseModelv2,
  facetsData?: Record<string, Record<string, number>>
): Omit<MappedNativeCategory, 'label'> | undefined {
  const genreType = data.genreTypes.find((genreType) => genreType.name === nativeCategory.genreType)
  if (!genreType) return undefined

  return {
    genreTypeKey: genreType.name,
    children: genreType.values.reduce<MappedGenreTypes>((res, genreTypeValue) => {
      res[genreTypeValue.name] = {
        label: genreTypeValue.value,
        nbResultsFacet:
          facetsData?.[getFacetTypeFromGenreTypeKey(genreType.name)]?.[genreTypeValue.name] ?? 0,
      }

      return res
    }, {} as MappedGenreTypes),
  }
}

export function createMappingTree(
  data?: SubcategoriesResponseModelv2,
  facetsData?: Record<string, Record<string, number>>
) {
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

      const mappedNativeCategories = nativeCategories.length
        ? nativeCategories.reduce<MappedNativeCategories>(
            (nativeCategoriesResult, nativeCategory) => {
              nativeCategoriesResult[nativeCategory.name] = {
                label: nativeCategory.value ?? 'Tout',
                nbResultsFacet: facetsData?.['offer.nativeCategoryId']?.[nativeCategory.name] ?? 0,
                ...(getNativeCategoryGenreTypes(data, nativeCategory, facetsData) || {}),
              }

              return nativeCategoriesResult
            },
            {} as MappedNativeCategories
          )
        : undefined

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
