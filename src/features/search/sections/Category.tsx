import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Platform } from 'react-native'
import { useTheme } from 'styled-components'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { FilterRow } from 'features/search/atoms/FilterRow'
import { CategoriesModal } from 'features/search/pages/CategoriesModal'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { useModal } from 'ui/components/modals/useModal'
import { All } from 'ui/svg/icons/bicolor/All'

export const Category: React.FC = () => {
  const { searchState } = useSearch()
  const { offerCategories } = searchState
  const logUseFilter = useLogFilterOnce(SectionTitle.Category)
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const { navigate } = useNavigation<UseNavigationType>()
  const {
    visible: categoriesModalVisible,
    showModal: showCategoriesModal,
    hideModal: hideCategoriesModal,
  } = useModal(false)
  const theme = useTheme()
  const { isDesktopViewport } = theme
  const filterPageIsModal = Platform.OS === 'web' && isDesktopViewport

  const onPress = useCallback(() => {
    logUseFilter()
    if (filterPageIsModal) {
      showCategoriesModal()
      return
    }

    navigate('SearchCategories')
  }, [filterPageIsModal, logUseFilter, navigate, showCategoriesModal])

  return (
    <React.Fragment>
      <FilterRow
        icon={All}
        title="Catégorie"
        description={searchGroupLabelMapping[offerCategories?.[0]]}
        onPress={onPress}
      />
      <CategoriesModal visible={categoriesModalVisible} dismissModal={hideCategoriesModal} />
    </React.Fragment>
  )
}
