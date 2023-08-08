import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { OfferAnalyticsParams } from 'libs/analytics/types'
import { Offer } from 'shared/offer/types'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Spacer, getSpacing } from 'ui/theme'

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
          <React.Fragment key={item.objectID}>
            <HorizontalOfferTile
              offer={item}
              onPress={hideModal}
              analyticsParams={analyticsParams}
            />
          </React.Fragment>
        )}
      />
      <Spacer.Column numberOfSpaces={4} />
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const ItemSeparatorContainer = styled.View({
  height: 2,
  marginVertical: getSpacing(4),
})

function ItemSeparatorComponent() {
  return (
    <ItemSeparatorContainer>
      <Separator />
    </ItemSeparatorContainer>
  )
}
