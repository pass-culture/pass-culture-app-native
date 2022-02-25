import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useFilterCount } from 'features/search/utils/useFilterCount'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { styledButton } from 'ui/components/buttons/styledButton.web'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Filter as FilterIconDefault } from 'ui/svg/icons/Filter'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const Filter: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useSearch()
  const { dispatch } = useStagedSearch()
  const filterCount = useFilterCount(searchState)

  const onPress = () => {
    dispatch({ type: 'SET_STATE', payload: searchState })
    navigate('SearchFilter')
  }

  return (
    <Container
      onPress={onPress}
      {...accessibilityAndTestId(t`Afficher les filtres`, 'FilterButton')}>
      <StyledLinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#bf275f', '#5a0d80']}>
        <FilterIcon />
        <Spacer.Row numberOfSpaces={1} />
        <Title>{t`Filtrer`}</Title>
        <Spacer.Row numberOfSpaces={2} />
        {filterCount > 0 && (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={1} />
            <WhiteBackgroundContainer>
              <FilterCountText>{filterCount}</FilterCountText>
            </WhiteBackgroundContainer>
            <Spacer.Row numberOfSpaces={1} />
          </React.Fragment>
        )}
      </StyledLinearGradient>
    </Container>
  )
}

const FilterIcon = styled(FilterIconDefault).attrs(({ theme }) => ({
  color: theme.colors.white,
}))``

const Container = styledButton(Touchable)({ overflow: 'hidden' })

const StyledLinearGradient = styled(LinearGradient)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.button,
  alignItems: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
  paddingHorizontal: getSpacing(3),
  height: getSpacing(10),
}))

const FilterCountText = styled(Typo.ButtonText)(({ theme }) => ({ color: theme.colors.primary }))

const Title = styled(Typo.ButtonText)(({ theme }) => ({ color: theme.colors.white }))

const WhiteBackgroundContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  backgroundColor: theme.colors.white,
  borderRadius: getSpacing(6),
  aspectRatio: '1',
  width: getSpacing(6),
  alignItems: 'center',
  justifyContent: 'center',
}))
