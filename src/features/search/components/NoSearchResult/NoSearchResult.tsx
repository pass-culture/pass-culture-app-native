import React from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { SearchState } from 'features/search/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type NoSearchResultProps = {
  searchState: SearchState
  navigateToSearchFilter: (searchState: SearchState) => void
  onResetPlace: () => void
  navigateToSearchResults: (searchState: SearchState) => void
}

export const NoSearchResult = ({
  searchState,
  navigateToSearchFilter,
  onResetPlace,
  navigateToSearchResults,
}: NoSearchResultProps) => {
  const title = 'Pas de résultat'
  const subtitle = searchState.query ? `pour "${searchState.query}"` : ''

  const noResultsProps = {
    errorDescription: 'Élargis la zone de recherche pour plus de résultats.',
    ctaWording: 'Élargir la zone de recherche',
    onPress: () => {
      analytics.logExtendSearchRadiusClicked(searchState.searchId)
      onResetPlace()
      navigateToSearchResults({
        ...searchState,
        locationFilter: {
          locationType: LocationMode.EVERYWHERE,
        },
      })
    },
  }

  const noResultsEverywhereProps = {
    errorDescription: searchState.query
      ? 'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
      : 'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.',
    ctaWording: 'Modifier mes filtres',
    onPress: () => navigateToSearchFilter(searchState),
  }
  const props =
    searchState.locationFilter.locationType === LocationMode.EVERYWHERE
      ? noResultsEverywhereProps
      : noResultsProps

  return (
    <NoSearchResultsWrapper>
      <Container accessibilityRole={AccessibilityRole.STATUS}>
        <ContainerNoOffer>
          <StyledNoOffer />
        </ContainerNoOffer>
        <ContainerText>
          <Title>{title}</Title>
          {subtitle ? <Typo.Body>{subtitle}</Typo.Body> : null}
          <ErrorDescriptionContainer>
            <ErrorDescription accessibilityLiveRegion="assertive">
              {props.errorDescription}
            </ErrorDescription>
          </ErrorDescriptionContainer>
        </ContainerText>
        <View>
          <ButtonPrimary
            wording={props.ctaWording}
            onPress={props.onPress}
            accessibilityRole={AccessibilityRole.BUTTON}
          />
        </View>
      </Container>
    </NoSearchResultsWrapper>
  )
}

const NoSearchResultsWrapper = styled(ScrollView).attrs({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
})``

const ContainerNoOffer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  flexShrink: 0,
  ...(theme.isMobileViewport && {
    marginTop: -(theme.tabBar.height + theme.designSystem.size.spacing.xxxl),
  }),
}))

const StyledNoOffer = styled(NoOffer).attrs(({ theme }) => ({
  size: theme.isDesktopViewport
    ? theme.illustrations.sizes.fullPage
    : theme.illustrations.sizes.medium,
  color: theme.designSystem.color.icon.subtle,
}))``

const Container = styled.View(({ theme }) => ({
  paddingVertical: getSpacing(30),
  ...(theme.isDesktopViewport ? {} : { marginHorizontal: theme.designSystem.size.spacing.xl }),
}))

const ContainerText = styled.View(({ theme }) => ({
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
  maxWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
}))

const Title = styled(Typo.Title4).attrs({
  ...getHeadingAttrs(2),
})(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const ErrorDescription = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const ErrorDescriptionContainer = styled(Typo.Body)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  textAlign: 'center',
}))
