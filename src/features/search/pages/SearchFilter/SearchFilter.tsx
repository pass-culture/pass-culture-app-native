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
import { DEFAULT_RADIUS } from 'features/search/constants'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour, LocationType } from 'features/search/enums'
import { LocationFilter, SearchView } from 'features/search/types'
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
  const { userPosition: position, isGeolocated, isCustomPosition, place } = useLocation()
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
    const getLocationFilter = (): LocationFilter => {
      const { locationFilter } = searchState
      const aroundRadius =
        locationFilter.locationType === LocationType.EVERYWHERE ||
        locationFilter.locationType === LocationType.VENUE
          ? DEFAULT_RADIUS
          : locationFilter.aroundRadius
      if (isCustomPosition && place) {
        return {
          locationType: LocationType.PLACE,
          place,
          aroundRadius: aroundRadius ?? DEFAULT_RADIUS,
        }
      } else if (isGeolocated && position) {
        return {
          locationType: LocationType.AROUND_ME,
          aroundRadius,
        }
      } else {
        return { locationType: LocationType.EVERYWHERE }
      }
    }
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...searchState,
        locationFilter: getLocationFilter(),
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
    logReinitializeFilters()
  }, [
    dispatch,
    isCustomPosition,
    isGeolocated,
    logReinitializeFilters,
    place,
    position,
    searchState,
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
