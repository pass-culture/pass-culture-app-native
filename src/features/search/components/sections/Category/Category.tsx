import React, { useCallback, useMemo } from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper'
import {
  categoryAllValue,
  getDescription,
  getNativeCategoriesFromEnumArray,
  getSearchGroupsFromEnumArray,
} from 'features/search/helpers/categoriesHelpers'
import { CategoriesModal } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { DescriptionContext } from 'features/search/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { useModal } from 'ui/components/modals/useModal'
import { All } from 'ui/svg/icons/bicolor/All'

export const Category: React.FC = () => {
  const { searchState } = useSearch()
  const { offerCategories, offerNativeCategories, offerGenreTypes } = searchState
  const { data } = useSubcategories()
  const {
    visible: categoriesModalVisible,
    showModal: showCategoriesModal,
    hideModal: hideCategoriesModal,
  } = useModal(false)

  const onPress = useCallback(() => {
    showCategoriesModal()
  }, [showCategoriesModal])

  const descriptionContext: DescriptionContext = useMemo(() => {
    return {
      selectedCategory: getSearchGroupsFromEnumArray(data, offerCategories)[0] || categoryAllValue,
      selectedNativeCategory:
        getNativeCategoriesFromEnumArray(data, offerNativeCategories)?.[0] || null,
      selectedGenreType: offerGenreTypes?.[0] || null,
    }
  }, [data, offerCategories, offerGenreTypes, offerNativeCategories])

  const description = useMemo(() => getDescription(descriptionContext), [descriptionContext])

  return (
    <React.Fragment>
      <FilterRow icon={All} title="Catégorie" description={description} onPress={onPress} />
      <CategoriesModal
        accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
        isVisible={categoriesModalVisible}
        hideModal={hideCategoriesModal}
      />
    </React.Fragment>
  )
}
