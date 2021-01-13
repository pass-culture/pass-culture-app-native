import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { Spacer, Typo } from 'ui/theme'

export const SearchFilter: React.FC = () => (
  <Container>
    <Spacer.Flex />
    <Typo.Hero>{_(t`SearchFilter`)}</Typo.Hero>
    <Spacer.Flex />
  </Container>
)

const Container = styled.View({ flex: 1, alignItems: 'center' })
