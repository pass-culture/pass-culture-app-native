import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import Section from 'features/search/components/sections'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour, LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { useLocation } from 'libs/geolocation'
import { useFunctionOnce } from 'libs/hooks'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Spacer } from 'ui/theme'

export const SearchFilter: React.FC = () => {
  const headerHeight = useGetHeaderHeight()
  const { searchState, dispatch } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const logReinitializeFilters = useFunctionOnce(() => {
    analytics.logReinitializeFilters(searchState.searchId)
  })
  const { userPosition: position } = useLocation()
  const { user } = useAuthContext()
  const { params } = useRoute<UseRouteType<'SearchFilter'>>()
  const { isMobileViewport } = useTheme()

  useEffect(() => {
    dispatch({ type: 'SET_STATE', payload: params || { view: SearchView.Landing } })
  }, [dispatch, params])

  const onGoBack = useCallback(() => {
    navigate(
      ...getTabNavConfig('Search', {
        ...params,
        view: SearchView.Results,
      })
    )
  }, [navigate, params])

  const onSearchPress = useCallback(() => {
    const additionalSearchState = {
      ...searchState,
      view: SearchView.Results,
    }
    navigate(...getTabNavConfig('Search', additionalSearchState))
  }, [navigate, searchState])

  const onResetPress = useCallback(() => {
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...initialSearchState,
        locationFilter: position
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

  const shouldDisplayCloseButton = isMobileViewport

  return (
    <Container>
      <PageHeaderWithoutPlaceholder title="Filtres" onGoBack={onGoBack} />

      <ScrollView scrollEnabled keyboardShouldPersistTaps="always">
        <Placeholder height={headerHeight} />
        <VerticalUl>
          {/* Catégories */}
          <StyledLi>
            <Spacer.Column numberOfSpaces={6} />
            <Section.Category onClose={shouldDisplayCloseButton ? onGoBack : undefined} />
            <Spacer.Column numberOfSpaces={4} />
            <Separator />
          </StyledLi>

          {/* Duo */}
          {!!hasDuoOfferToggle && (
            <StyledLi>
              <Spacer.Column numberOfSpaces={4} />
              <Section.OfferDuo onClose={shouldDisplayCloseButton ? onGoBack : undefined} />
              <Spacer.Column numberOfSpaces={4} />
              <Separator />
            </StyledLi>
          )}

          {/* Point de vente */}
          <StyledLi>
            <Spacer.Column numberOfSpaces={4} />
            <Section.Venue />
            <Spacer.Column numberOfSpaces={4} />
            <Separator />
          </StyledLi>

          {/* Prix */}
          <StyledLi>
            <Spacer.Column numberOfSpaces={4} />
            <Section.Price onClose={shouldDisplayCloseButton ? onGoBack : undefined} />
            <Spacer.Column numberOfSpaces={4} />
            <Separator />
          </StyledLi>

          {/* Date & Heure */}
          <StyledLi>
            <Spacer.Column numberOfSpaces={4} />
            <Section.DateHour onClose={shouldDisplayCloseButton ? onGoBack : undefined} />
            <Spacer.Column numberOfSpaces={6} />
          </StyledLi>
        </VerticalUl>
      </ScrollView>
      <BlurHeader height={headerHeight} />
      <Spacer.Column numberOfSpaces={10} />
      <FilterPageButtons
        onResetPress={onResetPress}
        onSearchPress={onSearchPress}
        isModal={false}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))

const Separator = styled.View(({ theme }) => ({
  width: '100%',
  height: 2,
  backgroundColor: theme.colors.greyLight,
}))

const StyledLi = styled(Li)({
  display: 'flex',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
