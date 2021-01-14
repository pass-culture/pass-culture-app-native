import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer, Typo, ColorsEnum } from 'ui/theme'

export const SearchFilter: React.FC = () => {
  const [rightComponentWidth, setRightComponentWidth] = useState(0)

  const onRightComponentLayout = (event: LayoutChangeEvent) => {
    if (rightComponentWidth !== 0) return
    const { width } = event.nativeEvent.layout
    setRightComponentWidth(width)
  }

  return (
    <Container>
      <PageHeader
        title={_(t`Filtrer`)}
        rightComponentWidth={rightComponentWidth}
        rightComponent={
          <Typo.ButtonText color={ColorsEnum.WHITE} onLayout={onRightComponentLayout}>
            {_(t`Réinitialiser`)}
          </Typo.ButtonText>
        }
      />
      <Spacer.Flex />
      <Typo.Hero>{_(t`SearchFilter`)}</Typo.Hero>
      <Spacer.Flex />
    </Container>
  )
}

const Container = styled.View({ flex: 1, alignItems: 'center' })
