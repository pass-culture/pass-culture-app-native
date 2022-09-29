import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutChangeEvent, ScrollView, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useUserProfileInfo } from 'features/profile/api'
import { ShowResults, ReinitializeFilters } from 'features/search/atoms/Buttons'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import Section from 'features/search/sections'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { getSpacing, Spacer } from 'ui/theme'

const useScrollToEndOnTimeOrDateActivation = () => {
  const windowHeight = useWindowDimensions().height
  const { searchState } = useStagedSearch()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const shouldScrollRef = useRef<boolean>(false)

  useEffect(() => {
    shouldScrollRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!searchState.date])

  useEffect(() => {
    shouldScrollRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const [scrollEnabled, setScrollEnabled] = useState(true)
  const { navigate } = useNavigation<UseNavigationType>()

  const onGoBack = useCallback(() => {
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
      })
    )
  }, [navigate, searchState])

  return (
    <Container>
      <PageHeader
        title="Filtrer"
        RightComponent={ReinitializeFilters}
        background="primary"
        withGoBackButton
        onGoBack={onGoBack}
      />
      <React.Fragment>
        <StyledScrollView ref={scrollViewRef} scrollEnabled={scrollEnabled}>
          <Spacer.Column numberOfSpaces={4} />

          {/* Localisation */}
          <Section.Location />
          <Spacer.Column numberOfSpaces={4} />
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
          <Spacer.Column numberOfSpaces={4} />
          <Section.Category />
          <Spacer.Column numberOfSpaces={4} />
          <Separator />

          {/* Type d'offre */}
          <Spacer.Column numberOfSpaces={4} />
          <Section.OfferType />
          <Spacer.Column numberOfSpaces={4} />
          <Separator />
          <Spacer.Column numberOfSpaces={4} />

          {/* Prix */}
          <Section.Price />
          <Separator marginVertical={getSpacing(4)} />

          {/* Uniquement les offres duo */}
          {!!profile?.isBeneficiary && (
            <React.Fragment>
              <Section.DuoOffer />
              <Separator marginVertical={getSpacing(4)} />
            </React.Fragment>
          )}

          {/* Uniquement les nouveautés */}
          <Section.NewOffer />
          <Separator marginVertical={getSpacing(4)} />

          {/* Date */}
          <Section.Date />
          <Separator marginVertical={getSpacing(4)} />

          {/* Date de l'offre */}
          {!!searchState.date && (
            <React.Fragment>
              <Section.OfferDate setScrollEnabled={setScrollEnabled} />
              <Separator marginVertical={getSpacing(4)} />
              <Spacer.Column numberOfSpaces={0} onLayout={scrollToEnd} />
            </React.Fragment>
          )}

          {/* Heure */}
          <Section.Hour />

          {/*Créneau horaire */}
          {!!searchState.timeRange && (
            <React.Fragment>
              <Separator marginVertical={getSpacing(4)} />
              <Section.TimeSlot />
              <Spacer.Column numberOfSpaces={0} onLayout={scrollToEnd} />
            </React.Fragment>
          )}

          <Spacer.Column numberOfSpaces={30} />
        </StyledScrollView>
      </React.Fragment>

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
const ShowResultsContainer = styled.View({
  width: '100%',
  position: 'absolute',
  bottom: getSpacing(6),
  paddingHorizontal: getSpacing(6),
  alignItems: 'center',
})
