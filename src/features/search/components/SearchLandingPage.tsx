import { t } from '@lingui/macro'
import React from 'react'
import { Dimensions, ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { SearchButton } from 'features/search/atoms/SearchButton'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const { width } = Dimensions.get('window')

export const SearchLandingPage: React.FC = () => {
  const { searchState } = useSearch()
  return (
    <React.Fragment>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.Flex />
        <Typo.Hero>{_(t`Je cherche`)}</Typo.Hero>
        <Typo.Caption>{searchState.offerCategories.join('\n')}</Typo.Caption>
        <Separator />
        <Typo.Hero>{_(t`Où`)}</Typo.Hero>
        <Typo.Caption>{searchState.searchAround}</Typo.Caption>
        <Spacer.Flex flex={2} />
      </ScrollView>
      <SearchButtonContainer>
        <SearchButton />
        <Spacer.BottomScreen />
      </SearchButtonContainer>
    </React.Fragment>
  )
}

const contentContainerStyle: ViewStyle = { alignItems: 'center', flexGrow: 1 }
const Separator = styled.View({
  height: 2,
  width: width - getSpacing(2 * 6),
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginVertical: getSpacing(4),
})
const SearchButtonContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
  width: width - getSpacing(2 * 6),
})
