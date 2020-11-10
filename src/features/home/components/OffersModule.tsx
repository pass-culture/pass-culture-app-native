import React from 'react'
import { Alert, FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle } from 'features/home/atoms'
import { Offers, OffersWithCover } from 'features/home/contentful'
import { useFetchAlgolia } from 'libs/algolia'
import { Gutter, Margin } from 'ui/theme'

import { isErrorWithMessage } from '../../../libs/typesUtils/typeGuards'

type OfferWithOptionalCover = Partial<OffersWithCover> &
  Pick<Offers, 'algolia' | 'display' | 'moduleId'>

export const OffersModule = (props: OfferWithOptionalCover) => {
  const {
    algolia: parameters,
    display: { minOffers, title, layout },
    moduleId,
  } = props

  const { hits, nbHits } = useFetchAlgolia({
    algoliaParameters: parameters,
    onError: (error: unknown) =>
      Alert.alert('Error', isErrorWithMessage(error) ? error.message : 'algolia-error'),
    queryKey: `module-${moduleId}`,
  })

  const shouldModuleBeDisplayed = hits.length > 0 && nbHits >= minOffers
  if (!shouldModuleBeDisplayed) return <React.Fragment></React.Fragment>

  const showSeeMore =
    hits.length < nbHits &&
    !(parameters.tags || parameters.beginningDatetime || parameters.endingDatetime)
  return (
    <Container>
      <Margin horizontal />
      <ModuleTitle title={title} />
      <Gutter horizontal />
      <FlatList
        horizontal
        data={hits}
        renderItem={({ item }) => <OfferTile key={item.objectID} tile={item} layout={layout} />}
        keyExtractor={(item) => item.objectID}
        ListHeaderComponent={() => <Margin />}
        ItemSeparatorComponent={() => <Gutter />}
        ListFooterComponent={
          showSeeMore ? <React.Fragment></React.Fragment> : <React.Fragment></React.Fragment>
        } // TODO: 'See more' design
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
