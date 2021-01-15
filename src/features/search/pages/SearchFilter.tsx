import { t } from '@lingui/macro'
import React from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer, Typo, ColorsEnum } from 'ui/theme'

const rightButton = (onLayout: (event: LayoutChangeEvent) => void): JSX.Element => {
  return (
    <Typo.ButtonText onLayout={onLayout} color={ColorsEnum.WHITE}>
      {_(t`Réinitialiser`)}
    </Typo.ButtonText>
  )
}

export const SearchFilter: React.FC = () => {
  return (
    <Container>
      <PageHeader title={_(t`Filtrer`)} rightComponent={rightButton} />
      <Spacer.Flex />
      <Typo.Hero>{_(t`SearchFilter`)}</Typo.Hero>
      <Spacer.Flex />
    </Container>
  )
}

const Container = styled.View({ flex: 1, alignItems: 'center' })
