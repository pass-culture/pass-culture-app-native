import { useNavigationState } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  useAccessibilityFiltersContext,
  defaultProperties,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import Section from 'features/search/components/sections'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { LocationFilter, SearchView } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Spacer } from 'ui/theme'

export const SearchFilter: React.FC = () => {
  const { setDisabilities } = useAccessibilityFiltersContext()
  const enabledAccessibilityFilter = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_SEARCH_ACCESSIBILITY_FILTER
  )
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes[routes?.length - 1].name
  useSync(currentRoute === 'SearchFilter')

  const headerHeight = useGetHeaderHeight()
  const { searchState, dispatch } = useSearch()
  const { navigateToSearch } = useNavigateToSearch()
  const logReinitializeFilters = useFunctionOnce(() => {
    analytics.logReinitializeFilters(searchState.searchId)
  })
  const { place, selectedLocationMode, aroundMeRadius, aroundPlaceRadius } = useLocation()
  const { user } = useAuthContext()
  const { isMobileViewport } = useTheme()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const oldSearchState = useMemo(() => searchState, [])
  const onGoBack = useCallback(() => {
    navigateToSearch({ ...oldSearchState, view: SearchView.Results })
  }, [navigateToSearch, oldSearchState])

  const onSearchPress = useCallback(() => {
    navigateToSearch({
      ...searchState,
      view: SearchView.Results,
    })
  }, [navigateToSearch, searchState])

  const onResetPress = useCallback(() => {
    const getLocationFilter = (): LocationFilter => {
      switch (selectedLocationMode) {
        case LocationMode.AROUND_PLACE:
          return {
            locationType: selectedLocationMode,
            place: place as SuggestedPlace,
            aroundRadius: aroundPlaceRadius,
          }
        case LocationMode.AROUND_ME:
          return {
            locationType: selectedLocationMode,
            aroundRadius: aroundMeRadius,
          }
        case LocationMode.EVERYWHERE:
          return { locationType: selectedLocationMode }
      }
    }
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...searchState,
        locationFilter: getLocationFilter(),
        venue: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        offerGenreTypes: undefined,
        offerNativeCategories: undefined,
        beginningDatetime: undefined,
        date: null,
        endingDatetime: undefined,
        offerCategories: [],
        offerSubcategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: false,
        priceRange: null,
        tags: [],
        timeRange: null,
      },
    })
    setDisabilities(defaultProperties)
    logReinitializeFilters()
  }, [
    dispatch,
    searchState,
    logReinitializeFilters,
    selectedLocationMode,
    place,
    aroundPlaceRadius,
    aroundMeRadius,
    setDisabilities,
  ])

  const hasDuoOfferToggle = useMemo(() => {
    const isBeneficiary = !!user?.isBeneficiary
    const hasRemainingCredit = !!user?.domainsCredit?.all?.remaining

    return isBeneficiary && hasRemainingCredit
  }, [user?.isBeneficiary, user?.domainsCredit?.all?.remaining])

  const shouldDisplayCloseButton = isMobileViewport

  const sectionItems = [Section.Category]
  if (hasDuoOfferToggle) sectionItems.push(Section.OfferDuo)
  sectionItems.push(Section.Venue)
  sectionItems.push(Section.Price)
  sectionItems.push(Section.DateHour)
  if (enabledAccessibilityFilter) sectionItems.push(Section.Accessibility)

  return (
    <Container>
      <PageHeaderWithoutPlaceholder title="Filtres" onGoBack={onGoBack} />

      <ScrollView scrollEnabled keyboardShouldPersistTaps="always">
        <Placeholder height={headerHeight} />
        <VerticalUl>
          <Spacer.Column numberOfSpaces={2} />
          {sectionItems.map((SectionItem, index) => {
            return (
              <SectionWrapper key={index} isFirstSectionItem={index === 0}>
                <SectionItem onClose={shouldDisplayCloseButton ? onGoBack : undefined} />
              </SectionWrapper>
            )
          })}
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

const SectionWrapper: React.FunctionComponent<{
  children: React.JSX.Element
  isFirstSectionItem: boolean
}> = ({ children, isFirstSectionItem = false }) => {
  return (
    <StyledLi>
      {isFirstSectionItem ? null : <Separator />}
      <Spacer.Column numberOfSpaces={6} />
      {children}
      <Spacer.Column numberOfSpaces={6} />
    </StyledLi>
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
