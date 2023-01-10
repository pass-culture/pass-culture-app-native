import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import Section from 'features/search/components/sections'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { useFunctionOnce } from 'libs/hooks'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Spacer } from 'ui/theme'

export const SearchFilter: React.FC = () => {
  const { searchState, dispatch } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const logReinitializeFilters = useFunctionOnce(() => {
    analytics.logReinitializeFilters(searchState.searchId)
  })
  const { position } = useGeolocation()
  const { user } = useAuthContext()

  const onGoBack = useCallback(() => {
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
        view: SearchView.Results,
      })
    )
  }, [navigate, searchState])

  const onResetPress = useCallback(() => {
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...initialSearchState,
        locationFilter:
          position !== null
            ? { locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }
            : { locationType: LocationType.EVERYWHERE },
        minPrice: undefined,
        maxPrice: undefined,
        offerGenreTypes: undefined,
        offerNativeCategories: undefined,
      },
    })
    logReinitializeFilters()
  }, [dispatch, logReinitializeFilters, position])

  const hasDuoOfferToggle = useMemo(() => {
    const isBeneficiary = !!user?.isBeneficiary
    const hasRemainingCredit = !!user?.domainsCredit?.all?.remaining

    return isBeneficiary && hasRemainingCredit
  }, [user?.isBeneficiary, user?.domainsCredit?.all?.remaining])

  return (
    <Container>
      <PageHeaderSecondary title="Filtrer" onGoBack={onGoBack} />
      <React.Fragment>
        <StyledScrollView scrollEnabled>
          {/* Localisation */}
          <VerticalUl>
            <StyledLi>
              <Spacer.Column numberOfSpaces={4} />
              <Section.Location />
              <Spacer.Column numberOfSpaces={4} />
              <Separator />
            </StyledLi>

            {/* Catégories */}
            <StyledLi>
              <Spacer.Column numberOfSpaces={4} />
              <Section.Category />
              <Spacer.Column numberOfSpaces={4} />
              <Separator />
            </StyledLi>

            {/* Duo */}
            {!!hasDuoOfferToggle && (
              <StyledLi>
                <Spacer.Column numberOfSpaces={4} />
                <Section.OfferDuo />
                <Spacer.Column numberOfSpaces={4} />
                <Separator />
                <Spacer.Column numberOfSpaces={4} />
              </StyledLi>
            )}

            {/* Prix */}
            <StyledLi>
              <Section.Price />
              <Separator marginVertical={getSpacing(4)} />
            </StyledLi>

            {/* Date & Heure */}
            <StyledLi>
              <Section.DateHour />
            </StyledLi>
          </VerticalUl>
        </StyledScrollView>
      </React.Fragment>

      <FilterPageButtons onResetPress={onResetPress} onSearchPress={onGoBack} isModal={false} />
      <Spacer.BottomScreen />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledScrollView = styled(ScrollView)({
  flex: 1,
})

const Separator = styled.View<{ marginVertical?: number }>(({ theme, marginVertical = 0 }) => ({
  width: theme.appContentWidth - getSpacing(2 * 6),
  height: 2,
  backgroundColor: theme.colors.greyLight,
  alignSelf: 'center',
  marginVertical: marginVertical,
}))

const StyledLi = styled(Li)({
  display: 'flex',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
})
