import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { OfferCategory } from '../atoms/OfferCategory'

type Props = StackScreenProps<RootStackParamList, 'Offer'>

export const Offer: FunctionComponent<Props> = ({ route }: Props) => {
  const { id, algoliaHit } = route.params

  return (
    <Container>
      <Spacer.Flex />
      <Typo.Hero>{_(t`Offer`)}</Typo.Hero>
      <Typo.Caption testID="offerId">{id}</Typo.Caption>
      <Title testID="offerTitle" numberOfLines={3} adjustsFontSizeToFit>
        {algoliaHit?.offer.name}
      </Title>
      <OfferCategory
        category={algoliaHit?.offer.category || null}
        label={algoliaHit?.offer.label}
      />
      <Spacer.Flex />
    </Container>
  )
}

const Container = styled.View({ flex: 1, alignItems: 'center', paddingHorizontal: getSpacing(6) })
const Title = styled(Typo.Title3)({ textAlign: 'center' })
