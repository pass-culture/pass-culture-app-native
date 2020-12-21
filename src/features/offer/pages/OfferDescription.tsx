import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { Animated, FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferExtraData, OfferResponse } from 'api/gen'
import { RetryBoundary } from 'features/errors'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { highlightLinks, ParsedDescription } from 'libs/parsers/highlightLinks'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useOffer } from '../api/useOffer'
import { OfferHeader } from '../components'

type ExtraDataKeys = keyof Required<OfferExtraData>
export type ExtendedKeys = ExtraDataKeys | 'description'

type Item = { key: ExtraDataKeys; value: string } | { key: 'description'; value: ParsedDescription }

const EXTRA_DATA_KEY_MAPPING: { [k in ExtendedKeys]: string } = {
  description: _(t`en détail`),
  author: _(t`auteur`),
  durationMinutes: _(t`durée`),
  isbn: _(t`ISBN`),
  musicSubType: _(t`sous genre`),
  musicType: _(t`genre`),
  performer: _(t`interprète`),
  // 'photoCredit', _(t`crédit photo`), TODO(#5727) update schema and add this field
  showSubType: _(t`sous genre`),
  showType: _(t`genre`),
  stageDirector: _(t`metteur en scène`),
  speaker: _(t`intervenant`),
  visa: _(t`VISA`),
}

const KEY_ORDER: { [k in ExtendedKeys]: number } = {
  musicType: 0,
  musicSubType: 1,
  showType: 2,
  showSubType: 3,
  durationMinutes: 4,
  description: 5,
  author: 6,
  stageDirector: 7,
  performer: 8,
  speaker: 9,
  isbn: 10,
  visa: 11,
  // 'photoCredit', TODO(#5727) update schema and add this field
}

const sortExtraData = (itemA: Item, itemB: Item): number =>
  KEY_ORDER[itemA.key] - KEY_ORDER[itemB.key]

export const formatValue = (key: ExtraDataKeys, value: string | number): string => {
  if (key === 'durationMinutes') {
    const hours = Math.floor(+value / 60)
    const minutes = +value - 60 * hours
    return hours ? `${hours}h${minutes > 0 ? minutes : ''}` : `${minutes}m`
  }
  return value.toString()
}

const isExtraDataKey = (key: string): key is ExtraDataKeys => key in EXTRA_DATA_KEY_MAPPING

export const getContentFromOffer = (
  extraData: OfferResponse['extraData'],
  description: string
): Item[] => {
  const hits: Item[] = Object.entries(extraData || {})
    .map(([key, value]) => {
      if (key && isExtraDataKey(key) && (typeof value === 'string' || typeof value === 'number')) {
        return { key, value: formatValue(key, value) }
      }
      return undefined
    })
    .filter(Boolean) as Item[]

  if (description) {
    hits.push({ key: 'description', value: highlightLinks(description) })
  }

  return hits.sort(sortExtraData)
}

const renderExtraData = ({ item }: { item: Item }) => {
  const { key, value } = item
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

const OfferDescriptionComponent = () => {
  const { params } = useRoute<UseRouteType<'OfferDescription'>>()
  const { data: offerResponse } = useOffer({ offerId: params.id })
  const { description = '', extraData = {} } = offerResponse || {}

  return (
    <React.Fragment>
      <React.Fragment>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={14} />
        <FlatList
          testID="offer-description-list"
          data={getContentFromOffer(extraData, description)}
          renderItem={renderExtraData}
          ListHeaderComponent={Header}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={Footer}
          showsHorizontalScrollIndicator={false}
        />
      </React.Fragment>
      <OfferHeader
        title="Description"
        headerTransition={new Animated.Value(1)}
        showRightIcons={false}
      />
    </React.Fragment>
  )
}

const MarginContainer = styled.View({ marginHorizontal: getSpacing(6) })
const Header = () => <Spacer.Column numberOfSpaces={6} />
const Separator = () => <Spacer.Column numberOfSpaces={4} />
const Footer = () => <Spacer.Column numberOfSpaces={32} />

export const OfferDescription = withErrorBoundary(React.memo(OfferDescriptionComponent), {
  FallbackComponent: RetryBoundary,
})
