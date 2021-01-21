import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'
import { Spacer, Typo } from 'ui/theme'

export const SearchLandingPage: React.FC = () => {
  const { searchState } = useSearch()
  return (
    <CenterContainer>
      <Spacer.TopScreen />
      <Typo.Hero>{_(t`Je cherche`)}</Typo.Hero>
      <Typo.Caption>{searchState.offerCategories.join('\n')}</Typo.Caption>
      <Typo.Hero>{_(t`Où`)}</Typo.Hero>
      <Typo.Caption>{searchState.searchAround}</Typo.Caption>
      <Spacer.BottomScreen />
    </CenterContainer>
  )
}

const CenterContainer = styled.View({ alignItems: 'center' })
