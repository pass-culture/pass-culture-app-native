import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Animated, FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferExtraData } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useOffer } from '../api/useOffer'
import { OfferHeader } from '../components'
import { dehumanizeId } from '../services/dehumanizeId'

const EXTRA_DATA_KEY_MAPPING: { [k in keyof Required<OfferExtraData>]: string } = {
  author: _(t`auteur`),
  durationMinutes: _(t`durée`),
  isbn: _(t`ISBN`),
  musicSubType: _(t`sous genre`),
  musicType: _(t`genre`),
  performer: _(t`interprète`),
  showSubType: _(t`sous type`),
  showType: _(t`type`),
  stageDirector: _(t`metteur en scène`),
  speaker: _(t`intervenant`),
  visa: _(t`VISA`),
}

interface Item {
  key: keyof OfferExtraData
  value: string | undefined
}

const renderExtraData = ({ item }: { item: Item }) => {
  const { key, value } = item
  if (!value) return <React.Fragment key={key}></React.Fragment>
  const caption = key in EXTRA_DATA_KEY_MAPPING ? EXTRA_DATA_KEY_MAPPING[key] : key
  const upperCaseCaption = caption.slice(0, 1).toUpperCase() + caption.slice(1)

  return (
    <MarginContainer key={key}>
      <Typo.Caption>{upperCaseCaption}</Typo.Caption>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Body>{value}</Typo.Body>
    </MarginContainer>
  )
}

export const OfferDescription = () => {
  const { params } = useRoute<UseRouteType<'OfferDescription'>>()
  const { data: offerResponse } = useOffer({ offerId: dehumanizeId(params.id) })

  const hits: Item[] = offerResponse?.extraData
    ? Object.entries(offerResponse.extraData)
        .map(([key, value]) => key && value && ({ key, value } as Item))
        .filter(Boolean)
    : []

  return (
    <React.Fragment>
      <Container>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={14} />
        <FlatList
          data={hits}
          renderItem={renderExtraData}
          ListHeaderComponent={() => <Spacer.Column numberOfSpaces={6} />}
          ItemSeparatorComponent={() => <Spacer.Column numberOfSpaces={4} />}
          ListFooterComponent={() => <Spacer.Column numberOfSpaces={32} />}
          showsHorizontalScrollIndicator={false}
        />
      </Container>
      <OfferHeader
        title="Description"
        headerTransition={new Animated.Value(1)}
        showRightIcons={false}
      />
    </React.Fragment>
  )
}

const Container = styled.View({})
const MarginContainer = styled.View({ marginHorizontal: getSpacing(6) })
