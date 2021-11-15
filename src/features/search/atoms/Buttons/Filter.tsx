import { t } from '@lingui/macro'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { SearchView } from 'features/search/enums'
import { useSearch, useSearchView, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useFilterCount } from 'features/search/utils/useFilterCount'
import { Filter as FilterIcon } from 'ui/svg/icons/Filter'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const Filter: React.FC = () => {
  const { setSearchView } = useSearchView()
  const { searchState } = useSearch()
  const { dispatch: stagedDispatch } = useStagedSearch()
  const filterCount = useFilterCount(searchState)

  const onPress = () => {
    stagedDispatch({ type: 'SET_STATE', payload: searchState })
    setSearchView(SearchView.FILTERS)
  }

  return (
    <Container onPress={onPress} testID="FilterButton">
      <StyledLinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#bf275f', '#5a0d80']}>
        <FilterIcon color={ColorsEnum.WHITE} />
        <Spacer.Row numberOfSpaces={1} />
        <Title>{t`Filtrer`}</Title>
        <Spacer.Row numberOfSpaces={2} />
        {filterCount > 0 && (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={1} />
            <WhiteBackgroundContainer>
              <Typo.ButtonText color={ColorsEnum.PRIMARY}>{filterCount}</Typo.ButtonText>
            </WhiteBackgroundContainer>
            <Spacer.Row numberOfSpaces={1} />
          </React.Fragment>
        )}
      </StyledLinearGradient>
    </Container>
  )
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({ overflow: 'hidden' })

const StyledLinearGradient = styled(LinearGradient)({
  borderRadius: BorderRadiusEnum.BUTTON,
  alignItems: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
  paddingHorizontal: getSpacing(3),
  height: getSpacing(10),
})

const Title = styled(Typo.ButtonText)({ color: ColorsEnum.WHITE })
const WhiteBackgroundContainer = styled.View({
  flexDirection: 'row',
  backgroundColor: ColorsEnum.WHITE,
  borderRadius: getSpacing(6),
  aspectRatio: '1',
  width: getSpacing(6),
  alignItems: 'center',
  justifyContent: 'center',
})
