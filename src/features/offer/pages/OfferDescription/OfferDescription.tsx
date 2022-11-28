import { useRoute } from '@react-navigation/native'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { OfferExtraData, OfferResponse } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { highlightLinks, ParsedDescription } from 'libs/parsers/highlightLinks'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

type ExtraDataKeys = keyof Required<OfferExtraData>
export type ExtendedKeys = ExtraDataKeys | 'description' | 'photoCredit'

type Item =
  | { key: ExtraDataKeys; value: string }
  | { key: 'description'; value: ParsedDescription }
  | { key: 'photoCredit'; value: string }

const EXTRA_DATA_KEY_MAPPING: { [k in ExtendedKeys]: string } = {
  description: 'en détails',
  author: 'auteur',
  durationMinutes: 'durée',
  isbn: 'ISBN',
  musicSubType: 'spécialité',
  musicType: 'genre',
  performer: 'interprète',
  photoCredit: 'crédit photo',
  showSubType: 'spécialité',
  showType: 'type',
  stageDirector: 'metteur en scène',
  speaker: 'intervenant',
  visa: 'VISA',
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
  photoCredit: 12,
}

const sortExtraData = (itemA: Item, itemB: Item): number =>
  KEY_ORDER[itemA.key] - KEY_ORDER[itemB.key]

export const formatValue = (key: ExtraDataKeys, value: string | number): string => {
  if (key === 'durationMinutes') {
    const hours = Math.floor(+value / 60)
    const minutes = +value - 60 * hours
    const displayedMinutes = minutes > 0 ? minutes : ''
    return hours ? `${hours}h${displayedMinutes}` : `${minutes}m`
  }
  return value.toString()
}

const isExtraDataKey = (key: string): key is ExtraDataKeys => key in EXTRA_DATA_KEY_MAPPING

export const getContentFromOffer = (
  extraData: OfferResponse['extraData'],
  description: string | null,
  photoCredit?: string | null
): Item[] => {
  const hits: Item[] = Object.entries(extraData || {})
    .map(([key, value]) => {
      if (key && isExtraDataKey(key) && (typeof value === 'string' || typeof value === 'number')) {
        return { key, value: formatValue(key, value) }
      }
      return undefined
    })
    .filter(Boolean) as Item[]

  if (description) hits.push({ key: 'description', value: highlightLinks(description) })
  // TODO(PC-6083): remove this hack: photo credit is saved as string "undefined"
  if (photoCredit && photoCredit !== 'undefined')
    hits.push({ key: 'photoCredit', value: photoCredit })

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

export const OfferDescription = () => {
  const { params } = useRoute<UseRouteType<'OfferDescription'>>()
  const { data: offerResponse } = useOffer({ offerId: params.id })
  const { description = '', extraData = {}, image, name = '' } = offerResponse || {}
  const photoCredit = image?.credit

  const helmetTitle = `Détails de l'offre ${name} | pass Culture`
  return (
    <Container>
      <Helmet title={helmetTitle} />
      <PageHeaderSecondary title="Description" />
      <React.Fragment>
        <Spacer.Column numberOfSpaces={2} />
        <FlatList
          testID="offer-description-list"
          data={getContentFromOffer(extraData, description, photoCredit)}
          renderItem={renderExtraData}
          ListHeaderComponent={Header}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={Footer}
          showsHorizontalScrollIndicator={false}
        />
      </React.Fragment>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const MarginContainer = styled.View({ marginHorizontal: getSpacing(6) })
const Header = () => <Spacer.Column numberOfSpaces={6} />
const Separator = () => <Spacer.Column numberOfSpaces={4} />
const Footer = () => <Spacer.Column numberOfSpaces={32} />
