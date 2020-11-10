import React from 'react'
import { Alert, FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferTile, ModuleTitle } from 'features/home/atoms'
import { Offers, OffersWithCover } from 'features/home/contentful'
import { useFetchAlgolia } from 'libs/algolia'
import { isErrorWithMessage } from 'libs/typesUtils/typeGuards'

import { Spacer } from '../../../ui/theme'

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
      <Spacer.Column numberOfSpaces={6} />
      <ModuleTitle title={title} />
      <Spacer.Column numberOfSpaces={4} />
      <FlatList
        horizontal
        data={hits}
        renderItem={({ item }) => <OfferTile key={item.objectID} tile={item} layout={layout} />}
        keyExtractor={(item) => item.objectID}
        ListHeaderComponent={() => <Spacer.Row numberOfSpaces={6} />}
        ItemSeparatorComponent={() => <Spacer.Row numberOfSpaces={4} />}
        ListFooterComponent={
          showSeeMore ? <Spacer.Row numberOfSpaces={6} /> : <Spacer.Row numberOfSpaces={6} />
        } // TODO: 'See more' design
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
