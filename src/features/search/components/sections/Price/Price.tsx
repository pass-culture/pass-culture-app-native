import React, { useCallback } from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { getPriceAsNumber } from 'features/search/helpers/getPriceAsNumber/getPriceAsNumber'
import { getPriceDescription } from 'features/search/helpers/getPriceDescription/getPriceDescription'
import { PriceModal } from 'features/search/pages/modals/PriceModal/PriceModal'
import { useModal } from 'ui/components/modals/useModal'
import { Code } from 'ui/svg/icons/Code'

type Props = {
  onClose?: VoidFunction
}

export const Price = ({ onClose }: Props) => {
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
        icon={Code}
        title="Prix"
        description={getPriceDescription(minPrice, maxPrice)}
        onPress={onPress}
      />
      <PriceModal
        title="Prix"
        accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
        isVisible={searchPriceModalVisible}
        hideModal={hideSearchPriceModal}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
        onClose={onClose}
      />
    </React.Fragment>
  )
}
