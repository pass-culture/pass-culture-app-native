import { t } from '@lingui/macro'
import React, { useEffect, useRef } from 'react'
import { LayoutChangeEvent, ScrollView } from 'react-native'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { ShowResults, ReinitializeFilters } from 'features/search/atoms/Buttons'
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
  const { searchState } = useStagedSearch()
  const { data: profile } = useUserProfileInfo()
  const { scrollViewRef, scrollToEnd } = useScrollToEndOnTimeOrDateActivation()

  return (
    <Container>
      <React.Fragment>
        <StyledScrollView ref={scrollViewRef}>
          <Spacer.TopScreen />
          <Spacer.Column numberOfSpaces={16} />

          {/* Localisation */}
          <Section.Location />
          <Spacer.Column numberOfSpaces={6} />
          <Separator />

          {/* Rayon */}
          {!!('aroundRadius' in searchState.locationFilter) && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <Section.Radius />
              <Spacer.Column numberOfSpaces={6} />
              <Separator />
            </React.Fragment>
          )}

          {/* Catégories */}
          <Section.Category />
          <Spacer.Column numberOfSpaces={2} />
          <Separator />

          {/* Type d'offre */}
          <Section.OfferType />
          <Spacer.Column numberOfSpaces={2} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          {/* Prix */}
          <Section.Price />
          <Separator marginVertical={getSpacing(6)} />

          {/* Uniquement les offres gratuites */}
          <Section.FreeOffer />
          <Separator marginVertical={getSpacing(6)} />

          {/* Uniquement les offres duo */}
          {!!profile?.isBeneficiary && (
            <React.Fragment>
              <Section.DuoOffer />
              <Separator marginVertical={getSpacing(6)} />
            </React.Fragment>
          )}

          {/* Uniquement les nouveautés */}
          <Section.NewOffer />
          <Separator marginVertical={getSpacing(6)} />

          {/* Date */}
          <Section.Date />
          <Separator marginVertical={getSpacing(6)} />

          {/* Date de l'offre */}
          {!!searchState.date && (
            <React.Fragment>
              <Section.OfferDate />
              <Separator marginVertical={getSpacing(6)} />
              <Spacer.Column numberOfSpaces={0} onLayout={scrollToEnd} />
            </React.Fragment>
          )}

          {/* Heure */}
          <Section.Hour />

          {/*Créneau horaire */}
          {!!searchState.timeRange && (
            <React.Fragment>
              <Separator marginVertical={getSpacing(6)} />
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
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledScrollView = styled(ScrollView)({ flex: 1 })
const Separator = styled.View<{ marginVertical?: number }>(({ theme, marginVertical = 0 }) => ({
  width: theme.appContentWidth - getSpacing(2 * 6),
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  alignSelf: 'center',
  marginVertical: marginVertical,
}))
const ShowResultsContainer = styled.View({
  width: '100%',
  position: 'absolute',
  bottom: getSpacing(6),
  paddingHorizontal: getSpacing(6),
  alignItems: 'center',
})
