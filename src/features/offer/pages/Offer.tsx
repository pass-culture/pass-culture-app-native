import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'Offer'>

export const Offer: FunctionComponent<Props> = ({ route }: Props) => (
  <Container>
    <Spacer.Flex />
    <Typo.Hero>{_(t`Offer`)}</Typo.Hero>
    <Typo.Caption testID="offerId">{route.params.offerId}</Typo.Caption>
    <Spacer.Flex />
  </Container>
)

const Container = styled.View({ flex: 1, alignItems: 'center' })
