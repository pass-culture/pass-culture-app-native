import React, { useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import { ModuleTitle } from 'features/home/atoms'
import { VenueHit } from 'libs/search'
import { Spacer, Typo } from 'ui/theme'

type VenuesModuleProps = {
  hits: VenueHit[]
}

const keyExtractor = (item: VenueHit) => item.id

export const VenuesModule = (props: VenuesModuleProps) => {
  const { hits } = props

  const renderItem: ListRenderItem<VenueHit> = useCallback(({ item }) => {
    // TODO(antoinewg) create component VenueTile with image (copy from OfferTile)
    return <Typo.Body>{item.name}</Typo.Body>
  }, [])

  return (
    <React.Fragment>
      <ModuleTitle title="display.title" />
      <Spacer.Column numberOfSpaces={4} />
      <FlatList
        testID="VenuesModuleList"
        data={hits}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        horizontal={true}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </React.Fragment>
  )
}

const ItemSeparatorComponent = () => <Spacer.Row numberOfSpaces={4} />
