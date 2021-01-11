import React from 'react'
import styled from 'styled-components/native'

import { InfiniteHits } from 'features/search/components/InfiniteHits'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { _ } from 'libs/i18n'

export const Search: React.FC = () => (
  <Container>
    <SearchHeader />
    <InfiniteHits />
  </Container>
)

const Container = styled.View({ flex: 1, alignItems: 'center' })
