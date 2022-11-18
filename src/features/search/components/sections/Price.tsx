import React, { useCallback } from 'react'

import { FilterRow } from 'features/search/atoms/FilterRow'
import { SearchPrice } from 'features/search/pages/SearchPrice'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { getPriceAsNumber } from 'features/search/utils/getPriceAsNumber'
import { getPriceDescription } from 'features/search/utils/getPriceDescription'
import { useModal } from 'ui/components/modals/useModal'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'

export const Price: React.FC = () => {
  const { searchState } = useSearch()
  const {
    visible: searchPriceModalVisible,
    showModal: showSearchPriceModal,
    hideModal: hideSearchPriceModal,
  } = useModal(false)

  const minPrice: number | undefined = getPriceAsNumber(searchState.minPrice)
  const maxPrice: number | undefined = getPriceAsNumber(searchState.maxPrice)

  const onPress = useCallback(() => {
    showSearchPriceModal()
  }, [showSearchPriceModal])

  return (
    <React.Fragment>
      <FilterRow
        icon={OrderPrice}
        title="Prix"
        description={getPriceDescription(minPrice, maxPrice)}
        onPress={onPress}
      />
      <SearchPrice
        title="Prix"
        accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
        isVisible={searchPriceModalVisible}
        hideModal={hideSearchPriceModal}
      />
    </React.Fragment>
  )
}
