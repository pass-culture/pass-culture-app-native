import { useNavigationState } from '@react-navigation/native'
import { isEqual } from 'lodash'
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
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { LocationFilter } from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { Page } from 'ui/pages/Page'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { getSpacing } from 'ui/theme'

export const SearchFilter: React.FC = () => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

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
  const shouldDisplayCalendarModal = useFeatureFlag(RemoteStoreFeatureFlags.WIP_TIME_FILTER_V2)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const oldAccessibilityFilter = useMemo(() => disabilities, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const oldSearchState = useMemo(() => searchState, [])

  const getLocationFilter = useCallback((): LocationFilter => {
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
  }, [aroundMeRadius, aroundPlaceRadius, place, selectedLocationMode])

  const hasDefaultValues = isEqual(searchState, {
    ...initialSearchState,
    locationFilter: getLocationFilter(),
  })

  const onSearchPress = useCallback(() => {
    navigateToSearch({ ...searchState }, disabilities)
  }, [navigateToSearch, searchState, disabilities])

  const onGoBack = useCallback(() => {
    if (hasDefaultValues) {
      onSearchPress()
      return
    }
    navigateToSearch(oldSearchState, oldAccessibilityFilter)
  }, [hasDefaultValues, onSearchPress, navigateToSearch, oldSearchState, oldAccessibilityFilter])

  const onResetPress = useCallback(() => {
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...initialSearchState,
        locationFilter: getLocationFilter(),
      },
    })
    setDisabilities(defaultDisabilitiesProperties)
    logReinitializeFilters()
  }, [dispatch, getLocationFilter, setDisabilities, logReinitializeFilters])

  const hasDuoOfferToggle = useMemo(() => {
    const isBeneficiary = !!user?.isBeneficiary
    const hasRemainingCredit = !!user?.domainsCredit?.all?.remaining

    return isBeneficiary && hasRemainingCredit
  }, [user?.isBeneficiary, user?.domainsCredit?.all?.remaining])

  const onClose = isMobileViewport ? onGoBack : undefined

  return (
    <Page>
      <StyledSecondaryPageWithBlurHeader
        title="Filtres"
        onGoBack={onGoBack}
        scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}>
        <VerticalUl>
          <SectionWrapper isFirstSectionItem>
            {shouldDisplayCalendarModal ? (
              <Section.CalendarFilter onClose={onClose} />
            ) : (
              <Section.DateHour onClose={onClose} />
            )}
          </SectionWrapper>
          <SectionWrapper>
            <Section.Category onClose={onClose} />
          </SectionWrapper>
          {hasDuoOfferToggle ? (
            <SectionWrapper>
              <Section.OfferDuo onClose={onClose} />
            </SectionWrapper>
          ) : null}
          <SectionWrapper>
            <Section.Venue />
          </SectionWrapper>
          <SectionWrapper>
            <Section.Price
              currency={currency}
              euroToPacificFrancRate={euroToPacificFrancRate}
              onClose={onClose}
            />
          </SectionWrapper>
          <SectionWrapper>
            <Section.Accessibility onClose={onClose} />
          </SectionWrapper>
        </VerticalUl>
      </StyledSecondaryPageWithBlurHeader>
      <FilterPageButtons
        onResetPress={onResetPress}
        onSearchPress={onSearchPress}
        isModal={false}
        filterBehaviour={FilterBehaviour.SEARCH}
        isResetDisabled={hasDefaultValues}
      />
    </Page>
  )
}

const SectionWrapper: React.FunctionComponent<{
  children: React.JSX.Element
  isFirstSectionItem?: boolean
}> = ({ children, isFirstSectionItem = false }) => {
  return (
    <StyledLi isFirstSectionItem={isFirstSectionItem}>
      {isFirstSectionItem ? null : <Separator />}
      {children}
    </StyledLi>
  )
}

const Separator = styled.View(({ theme }) => ({
  width: '100%',
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginBottom: getSpacing(6),
}))

const StyledLi = styled(Li)<{ isFirstSectionItem?: boolean }>(({ isFirstSectionItem }) => ({
  display: 'flex',
  marginBottom: getSpacing(6),
  marginTop: isFirstSectionItem ? getSpacing(6) : undefined,
}))

const StyledSecondaryPageWithBlurHeader = styled(SecondaryPageWithBlurHeader)({
  marginBottom: getSpacing(4),
})
