import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useRef } from 'react'
import { LayoutChangeEvent, ScrollView, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ShowResults, ReinitializeFilters } from 'features/search/atoms/Buttons'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import Section from 'features/search/sections'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
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
  const { scrollViewRef } = useScrollToEndOnTimeOrDateActivation()
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
        <StyledScrollView ref={scrollViewRef} scrollEnabled>
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

            {/* Type d'offre */}
            <StyledLi>
              <Spacer.Column numberOfSpaces={4} />
              <Section.OfferType />
              <Spacer.Column numberOfSpaces={4} />
              <Separator />
              <Spacer.Column numberOfSpaces={4} />
            </StyledLi>

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

const StyledLi = styled(Li)({
  display: 'flex',
})
