import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferContentBase } from 'features/offer/components/OfferContent/OfferContentBase'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferContentProps } from 'features/offer/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

const CONTENT_CONTAINER_STYLE = { paddingBottom: getSpacing(22) }

export const OfferContent: FunctionComponent<OfferContentProps> = ({
  offer,
  searchGroupList,
  subcategory,
  chronicles,
  defaultReaction,
  headlineOffersCount,
  onReactionButtonPress,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const handlePress = (defaultIndex = 0) => {
    navigate('OfferPreview', { id: offer.id, defaultIndex })
  }

  return (
    <OfferCTAProvider>
      <OfferContentBase
        offer={offer}
        searchGroupList={searchGroupList}
        contentContainerStyle={CONTENT_CONTAINER_STYLE}
        onOfferPreviewPress={handlePress}
        BodyWrapper={BodyWrapper}
        chronicles={chronicles}
        headlineOffersCount={headlineOffersCount}
        subcategory={subcategory}
        defaultReaction={defaultReaction}
        onReactionButtonPress={onReactionButtonPress}
      />
    </OfferCTAProvider>
  )
}

const BodyWrapper = styled(ViewGap).attrs(() => ({ gap: 8, testID: 'offer-body-mobile' }))``
