import React, { useCallback, useMemo } from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { getDescription } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { CategoriesModal } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { DescriptionContext } from 'features/search/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { useModal } from 'ui/components/modals/useModal'
import { All } from 'ui/svg/icons/bicolor/All'

type Props = {
  onClose?: VoidFunction
}

export const Category = ({ onClose }: Props) => {
  const { searchState } = useSearch()
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
      category: searchState.offerCategories[0] || SearchGroupNameEnumv2.NONE,
      nativeCategory: searchState.offerNativeCategories?.[0] || null,
      genreType: searchState.offerGenreTypes?.[0]?.name || null,
    }
  }, [searchState.offerCategories, searchState.offerGenreTypes, searchState.offerNativeCategories])

  const description = useMemo(
    () => getDescription(data, descriptionContext),
    [data, descriptionContext]
  )

  return (
    <React.Fragment>
      <FilterRow icon={All} title="Catégorie" onPress={onPress} description={description} />
      <CategoriesModal
        accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
        isVisible={categoriesModalVisible}
        hideModal={hideCategoriesModal}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
        onClose={onClose}
      />
    </React.Fragment>
  )
}
