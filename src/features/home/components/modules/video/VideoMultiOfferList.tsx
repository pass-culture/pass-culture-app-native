import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferAnalyticsParams } from 'libs/analytics/types'
import { Offer } from 'shared/offer/types'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Spacer } from 'ui/theme'

interface OfferListProps {
  offers: Offer[]
  hideModal: () => void
  analyticsParams: OfferAnalyticsParams
}

export const VideoMultiOfferList: React.FC<OfferListProps> = ({
  offers,
  hideModal,
  analyticsParams,
}) => {
  return (
    <React.Fragment>
      <FlatList
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={offers}
        renderItem={({ item }) => (
          <HorizontalOfferTile
            key={item.objectID}
            offer={item}
            onPress={hideModal}
            analyticsParams={analyticsParams}
          />
        )}
      />
      <Spacer.Column numberOfSpaces={4} />
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const ItemSeparatorContainer = styled.View(({ theme }) => ({
  height: 2,
  marginVertical: theme.designSystem.size.spacing.l,
}))

function ItemSeparatorComponent() {
  return (
    <ItemSeparatorContainer>
      <Separator.Horizontal />
    </ItemSeparatorContainer>
  )
}
