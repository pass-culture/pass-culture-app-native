import React from 'react'

import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { FilterBehaviour } from 'features/search/enums'
import {
  CategoriesModal,
  getPreselectionLabel,
} from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { useModal } from 'ui/components/modals/useModal'
import { Sort } from 'ui/svg/icons/Sort'
import { useSearch } from 'features/search/context/SearchWrapper'

type Props = {
  onClose?: VoidFunction
}

export const Category = ({ onClose }: Props) => {
  const { facets } = useSearchResults()
  const { visible, showModal, hideModal } = useModal(false)
  const { searchState } = useSearch()
  const description = getPreselectionLabel(searchState.offerCategories)

  return (
    <React.Fragment>
      <FilterRow icon={Sort} title="Catégorie" onPress={showModal} description={description} />
      <CategoriesModal
        accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
        isVisible={visible}
        hideModal={hideModal}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
        onClose={onClose}
        facets={facets}
      />
    </React.Fragment>
  )
}
