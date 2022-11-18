import React, { useCallback } from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper/SearchWrapper'
import { CategoriesModal } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { useModal } from 'ui/components/modals/useModal'
import { All } from 'ui/svg/icons/bicolor/All'

export const Category: React.FC = () => {
  const { searchState } = useSearch()
  const { offerCategories } = searchState
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const {
    visible: categoriesModalVisible,
    showModal: showCategoriesModal,
    hideModal: hideCategoriesModal,
  } = useModal(false)

  const onPress = useCallback(() => {
    showCategoriesModal()
  }, [showCategoriesModal])

  return (
    <React.Fragment>
      <FilterRow
        icon={All}
        title="Catégorie"
        description={searchGroupLabelMapping[offerCategories?.[0]]}
        onPress={onPress}
      />
      <CategoriesModal
        title="Catégories"
        accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
        isVisible={categoriesModalVisible}
        hideModal={hideCategoriesModal}
      />
    </React.Fragment>
  )
}
