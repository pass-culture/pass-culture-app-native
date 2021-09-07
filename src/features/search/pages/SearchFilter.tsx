import { t } from '@lingui/macro'
import React, { useEffect, useRef } from 'react'
import { LayoutChangeEvent, ScrollView } from 'react-native'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { ShowResults, ReinitializeFilters } from 'features/search/atoms/Buttons'
import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import Section from 'features/search/sections'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

const useScrollToEndOnTimeOrDateActivation = () => {
  const windowHeight = useWindowDimensions().height
  const { searchState } = useStagedSearch()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const shouldScrollRef = useRef<boolean>(false)

  useEffect(() => {
    shouldScrollRef.current = true
  }, [!searchState.date])

  useEffect(() => {
    shouldScrollRef.current = true
  }, [!searchState.timeRange])

  const scrollToEnd = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout
    if (scrollViewRef.current !== null && shouldScrollRef.current) {
      scrollViewRef.current.scrollTo({ y: y - (4 * windowHeight) / 5 })
      shouldScrollRef.current = false
    }
  }

  return { scrollViewRef, scrollToEnd }
}

export const SearchFilter: React.FC = () => {
  const windowWidth = useWindowDimensions().width
  const { searchState } = useStagedSearch()
  const { data: profile } = useUserProfileInfo()
  const { scrollViewRef, scrollToEnd } = useScrollToEndOnTimeOrDateActivation()

  const showRadiusSection = getShowRadiusSection(
    searchState.locationFilter.locationType,
    searchState.locationFilter.venueId
  )

  return (
    <React.Fragment>
      <React.Fragment>
        <StyledScrollView ref={scrollViewRef}>
          <Spacer.TopScreen />
          <Spacer.Column numberOfSpaces={16} />

          {/* Localisation */}
          <Section.Location />
          <Spacer.Column numberOfSpaces={6} />
          <Separator windowWidth={windowWidth} />

          {/* Rayon */}
          {!!showRadiusSection && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <Section.Radius />
              <Spacer.Column numberOfSpaces={6} />
              <Separator windowWidth={windowWidth} />
            </React.Fragment>
          )}

          {/* Catégories */}
          <Section.Category />
          <Spacer.Column numberOfSpaces={2} />
          <Separator windowWidth={windowWidth} />

          {/* Type d'offre */}
          <Section.OfferType />
          <Spacer.Column numberOfSpaces={2} />
          <Separator windowWidth={windowWidth} />
          <Spacer.Column numberOfSpaces={6} />

          {/* Prix */}
          <Section.Price />
          <Separator windowWidth={windowWidth} marginVertical={getSpacing(6)} />

          {/* Uniquement les offres gratuites */}
          <Section.FreeOffer />
          <Separator windowWidth={windowWidth} marginVertical={getSpacing(6)} />

          {/* Uniquement les offres duo */}
          {!!profile?.isBeneficiary && (
            <React.Fragment>
              <Section.DuoOffer />
              <Separator windowWidth={windowWidth} marginVertical={getSpacing(6)} />
            </React.Fragment>
          )}

          {/* Uniquement les nouveautés */}
          <Section.NewOffer />
          <Separator windowWidth={windowWidth} marginVertical={getSpacing(6)} />

          {/* Date */}
          <Section.Date />
          <Separator windowWidth={windowWidth} marginVertical={getSpacing(6)} />

          {/* Date de l'offre */}
          {!!searchState.date && (
            <React.Fragment>
              <Section.OfferDate />
              <Separator windowWidth={windowWidth} marginVertical={getSpacing(6)} />
              <Spacer.Column numberOfSpaces={0} onLayout={scrollToEnd} />
            </React.Fragment>
          )}

          {/* Heure */}
          <Section.Hour />

          {/*Créneau horaire */}
          {!!searchState.timeRange && (
            <React.Fragment>
              <Separator windowWidth={windowWidth} marginVertical={getSpacing(6)} />
              <Section.TimeSlot />
              <Spacer.Column numberOfSpaces={0} onLayout={scrollToEnd} />
            </React.Fragment>
          )}

          <Spacer.Column numberOfSpaces={30} />
        </StyledScrollView>
      </React.Fragment>

      <PageHeader title={t`Filtrer`} RightComponent={ReinitializeFilters} />

      <ShowResultsContainer>
        <ShowResults />
        <Spacer.BottomScreen />
      </ShowResultsContainer>
    </React.Fragment>
  )
}

const StyledScrollView = styled(ScrollView)({ flex: 1 })
const Separator = styled.View<{ marginVertical?: number; windowWidth: number }>((props) => ({
  width: props.windowWidth - getSpacing(2 * 6),
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  alignSelf: 'center',
  marginVertical: props.marginVertical || 0,
}))
const ShowResultsContainer = styled.View({
  width: '100%',
  position: 'absolute',
  bottom: getSpacing(6),
  paddingHorizontal: getSpacing(6),
  alignItems: 'center',
})

function getShowRadiusSection(locationType: LocationType, venueId: number | null): boolean {
  if (locationType === LocationType.AROUND_ME) return true
  if (locationType === LocationType.EVERYWHERE) return false
  // We show the radius when we select an address (ex: Avignon), but not for venues (ex: Louvres).
  return typeof venueId !== 'number'
}
