import React from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { OfferDuoModal } from 'features/search/pages/modals/OfferDuoModal/OfferDuoModal'
import { useModal } from 'ui/components/modals/useModal'
import { Stock } from 'ui/svg/icons/Stock'

type Props = {
  onClose?: VoidFunction
}

export const OfferDuo = ({ onClose }: Props) => {
  const {
    visible: offerDuoModalVisible,
    showModal: showOfferDuoModal,
    hideModal: hideOfferDuoModal,
  } = useModal(false)

  const { searchState } = useSearch()
  const { offerIsDuo } = searchState
  const description = offerIsDuo ? 'Activé' : ''

  return (
    <React.Fragment>
      <FilterRow icon={Stock} title="Duo" description={description} onPress={showOfferDuoModal} />
      <OfferDuoModal
        title="Duo"
        accessibilityLabel="Ne pas filtrer les offres duo et retourner aux filtres de recherche"
        isVisible={offerDuoModalVisible}
        hideModal={hideOfferDuoModal}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
        onClose={onClose}
      />
    </React.Fragment>
  )
}
