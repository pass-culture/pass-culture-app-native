import React from 'react'
import styled from 'styled-components/native'

import { InfiniteHits } from 'features/search/components/InfiniteHits'
import { _ } from 'libs/i18n'
import { Spacer } from 'ui/theme'

export const Search: React.FC = () => (
  <Container>
    <Spacer.TopScreen />
    <InfiniteHits />
  </Container>
)

const Container = styled.View({ flex: 1, alignItems: 'center' })
