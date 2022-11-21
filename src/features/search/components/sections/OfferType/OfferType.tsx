import React, { useMemo } from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper'
import { OfferType as OfferTypeEnum } from 'features/search/enums'
import { OfferTypeModal } from 'features/search/pages/modals/OfferTypeModal/OfferTypeModal'
import { OfferTypes } from 'features/search/types'
import { useModal } from 'ui/components/modals/useModal'
import { Numeric } from 'ui/svg/icons/bicolor/Numeric'
import { Show } from 'ui/svg/icons/bicolor/Show'
import { Thing } from 'ui/svg/icons/bicolor/Thing'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { OtherOffer } from 'ui/svg/icons/OtherOffer'
import { AccessibleBicolorIconInterface } from 'ui/svg/icons/types'

export const OFFER_TYPES: Array<{
  type?: OfferTypes
  icon: React.FC<AccessibleBicolorIconInterface>
  label: OfferTypeEnum
}> = [
  { label: OfferTypeEnum.ALL_TYPE, icon: BicolorLogo },
  { type: 'isDigital', label: OfferTypeEnum.DIGITAL, icon: Numeric },
  { type: 'isEvent', label: OfferTypeEnum.EVENT, icon: Show },
  { type: 'isThing', label: OfferTypeEnum.THING, icon: Thing },
]

export function OfferType() {
  const { searchState } = useSearch()
  const { offerIsDuo, offerTypes } = searchState
  const {
    visible: offerTypeModalVisible,
    showModal: showOfferTypeModal,
    hideModal: hideOfferTypeModal,
  } = useModal(false)

  const description = useMemo(() => {
    if (offerTypes.isEvent) {
      return offerIsDuo ? `${OfferTypeEnum.EVENT} DUO` : OfferTypeEnum.EVENT
    } else if (offerTypes.isThing) {
      return OfferTypeEnum.THING
    } else if (offerTypes.isDigital) {
      return OfferTypeEnum.DIGITAL
    }
    return undefined
  }, [offerIsDuo, offerTypes])

  return (
    <React.Fragment>
      <FilterRow
        icon={OtherOffer}
        title="Type d'offre"
        description={description}
        onPress={showOfferTypeModal}
      />
      <OfferTypeModal
        title="Type d'offre"
        accessibilityLabel="Ne pas filtrer les type d'offre et retourner aux filtres de recherche"
        isVisible={offerTypeModalVisible}
        hideModal={hideOfferTypeModal}
      />
    </React.Fragment>
  )
}
