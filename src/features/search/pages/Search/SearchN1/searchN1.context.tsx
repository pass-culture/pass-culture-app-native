import React, { FC, PropsWithChildren, createContext, useMemo } from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { NativeCategoryEnum } from 'features/search/types'
import { ColorsEnum } from 'ui/theme/colors'

interface SearchData {
  query: string
  results: any[]
}

interface SearchContext {
  offerCategory: SearchGroupNameEnumv2
}

const SearchContext = createContext<SearchContext | undefined>(undefined)

type Props = {
  offerCategory: SearchGroupNameEnumv2
}

export const SearchProvider: FC<PropsWithChildren<Props>> = ({ offerCategory, children }) => {
  const nativeCategories = useNativeCategories(offerCategory)
  const offerCategoryTheme = useMemo(
    () => ({
      backgroundColor: CATEGORY_CRITERIA[offerCategory]?.fillColor,
      borderColor: CATEGORY_CRITERIA[offerCategory]?.borderColor,
    }),
    [offerCategory]
  )

  const subCategoriesContent = useMemo(
    () =>
      nativeCategories.map((nativeCategory) => ({
        label: nativeCategory[1].label,
        backgroundColor: offerCategoryTheme.backgroundColor as ColorsEnum,
        borderColor: offerCategoryTheme.borderColor as ColorsEnum,
        nativeCategory: nativeCategory[0] as NativeCategoryEnum,
      })),
    [offerCategoryTheme, nativeCategories]
  )

  return (
    <SearchContext.Provider value={{ searchData, setQuery, setResults }}>
      {children}
    </SearchContext.Provider>
  )
}
