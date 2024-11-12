import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferContentBase } from 'features/offer/components/OfferContent/OfferContentBase'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { OfferContentProps } from 'features/offer/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

const CONTENT_CONTAINER_STYLE = { paddingBottom: getSpacing(22) }

export const OfferContent: FunctionComponent<OfferContentProps> = ({
  offer,
  searchGroupList,
  subcategory,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { trackEventHasSeenOfferOnce } = useOfferBatchTracking(subcategory.id)

  const handlePress = (defaultIndex = 0) => {
    navigate('OfferPreview', { id: offer.id, defaultIndex })
  }

  const footer = useMemo(
    () => (
      <OfferCTAButton
        offer={offer}
        subcategory={subcategory}
        trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
      />
    ),
    [offer, subcategory, trackEventHasSeenOfferOnce]
  )

  return (
    <OfferContentBase
      offer={offer}
      searchGroupList={searchGroupList}
      contentContainerStyle={CONTENT_CONTAINER_STYLE}
      onOfferPreviewPress={handlePress}
      footer={footer}
      BodyWrapper={BodyWrapper}
      subcategory={subcategory}
    />
  )
}

const BodyWrapper = styled(ViewGap).attrs(() => ({ gap: 8, testID: 'offer-body-mobile' }))``
