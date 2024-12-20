import {
  BookSubType,
  BookType,
  GenreType,
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  OnlineOfflinePlatformChoicesEnumv2,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import {
  BaseCategory,
  Category,
  createMapping,
  createMappingTree,
  getBooksGenreTypes,
  getBooksNativeCategories,
  getKeyFromStringLabel,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { CategoriesModalFormProps } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { BooksNativeCategoriesEnum, NativeCategoryEnum, SearchState } from 'features/search/types'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

function isBookNativeCategory(
  category: NativeCategoryEnum | null
): category is BooksNativeCategoriesEnum {
  return (category as BooksNativeCategoriesEnum) !== undefined
}

function isNativeCategory(category: NativeCategoryEnum | null): category is NativeCategoryIdEnumv2 {
  return (category as NativeCategoryIdEnumv2) !== undefined
}

export const buildBookSearchPayloadValues = (
  data: SubcategoriesResponseModelv2,
  form: CategoriesModalFormProps
) => {
  const bookTrees = data.genreTypes.find((genreType) => genreType.name === GenreType.BOOK)
    ?.trees as BookType[]

  const buildNativeCategoryGtls = (nativeCategory: typeof form.nativeCategory) => {
    const nativeCat = bookTrees.find(
      (category: BookType) => getKeyFromStringLabel(category.label) === nativeCategory
    )
    return nativeCat?.gtls
  }

  const buildGenreTypeGtls = (
    nativeCategory: typeof form.nativeCategory,
    genreType: typeof form.genreType
  ) => {
    const nativeCat = bookTrees.find(
      (category: BookType) => getKeyFromStringLabel(category.label) === nativeCategory
    )
    return nativeCat?.children.find((genre) => getKeyFromStringLabel(genre.label) === genreType)
      ?.gtls
  }

  const buildBookGenreType = (genreType?: BookSubType) => {
    const genreKey = getKeyFromStringLabel(genreType?.label)
    if (!!genreType && !!genreKey) {
      return [
        {
          name: genreKey,
          value: genreType.label,
          key: GenreType.BOOK,
        },
      ]
    }
    return undefined
  }

  let gtls
  const natCatGtls = buildNativeCategoryGtls(form.nativeCategory)
  const genreTypeGtls = buildGenreTypeGtls(form.nativeCategory, form.genreType)

  if (form.genreType) {
    gtls = genreTypeGtls?.map((gtl) => gtl)
  } else if (form.nativeCategory) {
    gtls = natCatGtls?.map((gtl) => gtl)
  }

  const nativeCat = bookTrees.find(
    (category: BookType) => getKeyFromStringLabel(category.label) === form.nativeCategory
  )

  const genreType = nativeCat?.children.find(
    (genre) => getKeyFromStringLabel(genre.label) === form.genreType
  )

  const offerNativeCategories =
    form.nativeCategory && isNativeCategory(form.nativeCategory) ? [form.nativeCategory] : []
  const offerBookNativeCategories =
    form.nativeCategory && isBookNativeCategory(form.nativeCategory) ? [form.nativeCategory] : []

  const offerGenericNativeCategories = offerBookNativeCategories ? offerNativeCategories : []

  return {
    offerCategories: [form.category],
    offerNativeCategories: offerGenericNativeCategories,
    offerGenreTypes: buildBookGenreType(genreType),
    gtls,
  }
}

function buildSearchPayloadValues(
  data: SubcategoriesResponseModelv2,
  form: CategoriesModalFormProps
) {
  const buildGenreType = (genreTypeId: typeof form.genreType) => {
    if (genreTypeId === null) return []
    const genreType = getGenreTypeFromEnum(data, genreTypeId)
    if (!genreType) return undefined

    const genreTypeKey = data.genreTypes.find((genreType) =>
      genreType.values.map((v) => v.name).includes(genreTypeId)
    )?.name
    if (!genreTypeKey) return undefined

    return [{ name: genreTypeId, value: genreType.value, key: genreTypeKey }]
  }

  if (form.category === SearchGroupNameEnumv2.LIVRES) {
    return buildBookSearchPayloadValues(data, form)
  }

  const genreType = buildGenreType(form.genreType)
  if (!genreType) return undefined

  const offerNativeCategories =
    form.nativeCategory && isNativeCategory(form.nativeCategory) ? [form.nativeCategory] : []
  const offerBookNativeCategories =
    form.nativeCategory && isBookNativeCategory(form.nativeCategory) ? [form.nativeCategory] : []

  const offerGenericNativeCategories = offerBookNativeCategories ? offerNativeCategories : []

  return {
    offerCategories: form.category === SearchGroupNameEnumv2.NONE ? [] : [form.category],
    offerNativeCategories: offerGenericNativeCategories,
    offerGenreTypes: genreType,
    gtls: [],
  }
}

/**
 * Returns unique objects in array distinct by object key
 */
function getUniqueBy<T>(arr: T[], key: keyof T) {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}

/**
 * Returns correct icon for a category.
 */
export function getIcon(item?: BaseCategory) {
  if (!item) return undefined
  return CATEGORY_CRITERIA[item.key as SearchGroupNameEnumv2]?.icon
}

/**
 * Returns a `NativeCategoryResponseModelv2` from a `NativeCategoryIdEnumv2`.
 */
export function getNativeCategoryFromEnum(
  data: SubcategoriesResponseModelv2 | undefined,
  enumValue: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum | undefined
) {
  if (data && enumValue) {
    return (
      data.nativeCategories.find((nativeCategory) => nativeCategory.name === enumValue) ||
      getBooksNativeCategories(data).find((nativeCategory) => nativeCategory.name === enumValue)
    )
  }

  return undefined
}

function getGenreTypeFromEnum(data: SubcategoriesResponseModelv2 | undefined, genreType?: string) {
  if (data && genreType) {
    const genre = data.genreTypes
      .map((gt) => gt.values)
      .flat()
      .find((genreTypeValue) => genreTypeValue.name === genreType)

    const bookGenre = getBooksGenreTypes(data).find(
      (genreTypeValue) => genreTypeValue.name === genreType
    )
    return genre ?? bookGenre
  }

  return undefined
}

/**
 * Returns whether the category or native category is only online or not.
 * @param data
 * @param categoryId
 * @param nativeCategoryId
 */
export function isOnlyOnline(
  data: SubcategoriesResponseModelv2,
  categoryId?: SearchGroupNameEnumv2,
  nativeCategoryId?: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum
) {
  if (!categoryId && !nativeCategoryId) {
    return false
  }

  const platforms: OnlineOfflinePlatformChoicesEnumv2[] = [
    ...new Set(
      data.subcategories
        .filter((subcategory) =>
          nativeCategoryId
            ? subcategory.nativeCategoryId === nativeCategoryId
            : subcategory.searchGroupName === categoryId
        )
        .map((subcategory) => subcategory.onlineOfflinePlatform)
    ),
  ]

  const isOnlyOnline =
    platforms.includes(OnlineOfflinePlatformChoicesEnumv2.ONLINE) &&
    !platforms.includes(OnlineOfflinePlatformChoicesEnumv2.ONLINE_OR_OFFLINE) &&
    !platforms.includes(OnlineOfflinePlatformChoicesEnumv2.OFFLINE)

  return isOnlyOnline
}

/**
 * Sort comparator for `SearchGroupResponseModelv2` and `NativeCategoryResponseModelv2` objects.
 */
export function searchGroupOrNativeCategorySortComparator<
  T extends SearchGroupResponseModelv2 | NativeCategoryResponseModelv2,
>(a: T, b: T) {
  return (a?.value ?? '').localeCompare(b?.value ?? '')
}

/**
 * Check whether a native category is a subcategory of a category.
 */
export function isNativeCategoryOfCategory(
  data?: SubcategoriesResponseModelv2,
  searchGroup?: SearchGroupNameEnumv2,
  nativeCategory?: NativeCategoryIdEnumv2
) {
  if (!data) return false
  return data.subcategories.some(
    (subcategory) =>
      subcategory.searchGroupName === searchGroup && subcategory.nativeCategoryId === nativeCategory
  )
}

/**
 * Returns `SearchGroupResponseModelv2` array for a `NativeCategoryIdEnumv2` enum.
 */
export function getSearchGroupsEnumArrayFromNativeCategoryEnum(
  data?: SubcategoriesResponseModelv2,
  nativeCategoryId?: NativeCategoryIdEnumv2,
  availableCategoriesList?: SearchGroupNameEnumv2[]
) {
  if (!data) return []
  if (!nativeCategoryId) return []
  if (!availableCategoriesList) return []

  const searchGroup = data.nativeCategories
    .find((nativeCategory) => nativeCategory.name === nativeCategoryId)
    ?.parents.filter((nativeCategoryParent) =>
      availableCategoriesList.includes(nativeCategoryParent)
    )

  return [...new Set(searchGroup)]
}

/**
 * Return `nativeCategory` array for a `SearchGroupResponseModelv2` category.
 */
export function getNativeCategories(
  data: SubcategoriesResponseModelv2 | undefined,
  categoryEnum: SearchGroupNameEnumv2 | undefined
) {
  if (!data) return []
  if (!categoryEnum) return []
  if (categoryEnum === SearchGroupNameEnumv2.NONE) return []

  const nativeCategories = data.nativeCategories.filter((nativeCategory) =>
    nativeCategory.parents.includes(categoryEnum)
  )

  return getUniqueBy(nativeCategories, 'name').sort(searchGroupOrNativeCategorySortComparator)
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

function typedEntries<T extends Record<string, unknown>>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>
}

export const useNativeCategories = (searchGroup?: SearchGroupNameEnumv2) => {
  const { data: subcategories } = useSubcategories()
  const { facets } = useSearchResults()
  if (!searchGroup || !subcategories) return []

  const tree = createMapping()
  if (searchGroup === SearchGroupNameEnumv2.NONE || !tree[searchGroup]?.children) return []

  const nativeCategories = typedEntries(tree[searchGroup]?.children ?? {})
  if (searchGroup !== SearchGroupNameEnumv2.LIVRES) return nativeCategories

  const bookNativeCategories = nativeCategories.filter(
    ([_k, item]) => item.genreTypeKey === GenreType.BOOK && item.label !== 'Livres papier'
  )
  const additionalBookNativeCategories = nativeCategories.filter(
    ([_k, item]) => item.genreTypeKey !== GenreType.BOOK
  )

  return [...bookNativeCategories, ...additionalBookNativeCategories]
}

export const useSubcategoryIdsFromSearchGroups = (
  searchGroups: SearchGroupNameEnumv2[]
): SubcategoryIdEnumv2[] => {
  const { data } = useSubcategories()

  if (!data || !searchGroups.length) return []

  const { nativeCategories, subcategories } = data

  const filteredNativeCategories = nativeCategories
    .filter((nativeCategory) =>
      nativeCategory.parents.some((parent) => searchGroups.includes(parent))
    )
    .map((filteredNativeCategory) => filteredNativeCategory.name)

  return subcategories
    .filter((subcategory) => filteredNativeCategories.includes(subcategory.nativeCategoryId))
    .map((filteredSubcategory) => filteredSubcategory.id)
}

export function getFacetTypeFromGenreTypeKey(genreTypeKey: GenreType) {
  switch (genreTypeKey) {
    case GenreType.BOOK:
      return FACETS_FILTERS_ENUM.OFFER_BOOK_TYPE
    case GenreType.MUSIC:
      return FACETS_FILTERS_ENUM.OFFER_MUSIC_TYPE
    case GenreType.SHOW:
      return FACETS_FILTERS_ENUM.OFFER_SHOW_TYPE
    case GenreType.MOVIE:
    default:
      return FACETS_FILTERS_ENUM.OFFER_MOVIE_GENRES
  }
}

export function getNbResultsFacetLabel(nbResultsFacet?: number) {
  if (nbResultsFacet === undefined) {
    return undefined
  } else if (nbResultsFacet > 10000) {
    return '+10000'
  } else {
    return `${nbResultsFacet}`
  }
}

export const buildFormPayload = (
  form: CategoriesModalFormProps,
  data: SubcategoriesResponseModelv2
) => {
  const payload = buildSearchPayloadValues(data, form)
  if (!payload) return

  let isFullyDigitalOffersCategory = false
  if (payload.offerNativeCategories.length > 0) {
    isFullyDigitalOffersCategory = isOnlyOnline(data, undefined, payload.offerNativeCategories[0])
  } else if (payload.offerCategories.length > 0) {
    isFullyDigitalOffersCategory = isOnlyOnline(data, payload.offerCategories[0])
  }

  return { payload, isFullyDigitalOffersCategory }
}

export const sortCategoriesPredicate = (a: Category, b: Category) =>
  (a.position ?? Infinity) - (b.position ?? Infinity) || a.label.localeCompare(b.label)
