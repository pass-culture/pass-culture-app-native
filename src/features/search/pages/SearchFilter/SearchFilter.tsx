import { useNavigationState } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  defaultDisabilitiesProperties,
  useAccessibilityFiltersContext,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import Section from 'features/search/components/sections'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { LocationFilter } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Spacer } from 'ui/theme'

export const SearchFilter: React.FC = () => {
  const { disabilities, setDisabilities } = useAccessibilityFiltersContext()
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.[routes?.length - 1]?.name
  useSync(currentRoute === 'SearchFilter')

  const { searchState, dispatch } = useSearch()
  const { navigateToSearch } = useNavigateToSearch('SearchResults')
  const logReinitializeFilters = useFunctionOnce(() => {
    analytics.logReinitializeFilters(searchState.searchId)
  })
  const { place, selectedLocationMode, aroundMeRadius, aroundPlaceRadius } = useLocation()
  const { user } = useAuthContext()
  const { isMobileViewport } = useTheme()

  const oldAccessibilityFilter = useMemo(() => disabilities, [disabilities])

  const oldSearchState = useMemo(() => searchState, [searchState])
  const onGoBack = useCallback(() => {
    navigateToSearch(oldSearchState, oldAccessibilityFilter)
  }, [navigateToSearch, oldSearchState, oldAccessibilityFilter])

  const onSearchPress = useCallback(() => {
    navigateToSearch(
      {
        ...searchState,
      },
      disabilities
    )
  }, [navigateToSearch, searchState, disabilities])

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
        priceRange: null,
        tags: [],
        timeRange: null,
        gtls: [],
      },
    })
    setDisabilities(defaultDisabilitiesProperties)
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
  sectionItems.push(Section.Accessibility)

  return (
    <Container>
      <SecondaryPageWithBlurHeader
        title="Filtres"
        onGoBack={onGoBack}
        scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}>
        <VerticalUl>
          {sectionItems.map((SectionItem, index) => {
            return (
              <SectionWrapper key={index} isFirstSectionItem={index === 0}>
                <SectionItem onClose={shouldDisplayCloseButton ? onGoBack : undefined} />
              </SectionWrapper>
            )
          })}
        </VerticalUl>
      </SecondaryPageWithBlurHeader>
      <Spacer.Column numberOfSpaces={4} />
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
})
