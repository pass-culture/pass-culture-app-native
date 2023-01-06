import React from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { OfferDuoModal } from 'features/search/pages/modals/OfferDuoModal/OfferDuoModal'
import { useModal } from 'ui/components/modals/useModal'
import { OtherOffer } from 'ui/svg/icons/OtherOffer'

export function OfferDuo() {
  const {
    visible: offerDuoModalVisible,
    showModal: showOfferDuoModal,
    hideModal: hideOfferDuoModal,
  } = useModal(false)

  return (
    <React.Fragment>
      <FilterRow icon={OtherOffer} title="Duo" description="Activé" onPress={showOfferDuoModal} />
      <OfferDuoModal
        title="Duo"
        accessibilityLabel="Ne pas filtrer les offres duo et retourner aux filtres de recherche"
        isVisible={offerDuoModalVisible}
        hideModal={hideOfferDuoModal}
      />
    </React.Fragment>
  )
}
