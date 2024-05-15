import React, { useCallback } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/context/SearchWrapper'
import { useNavigateToSearchFilter } from 'features/search/helpers/useNavigateToSearchFilter/useNavigateToSearchFilter'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export function NoSearchResult() {
  const { searchState } = useSearch()
  const { navigateToSearchFilter } = useNavigateToSearchFilter()

  const onPressUpdateFilters = useCallback(() => {
    navigateToSearchFilter(searchState)
  }, [navigateToSearchFilter, searchState])

  const mainTitle = 'Pas de résultat'
  const mainTitleComplement = `pour "${searchState.query}"`
  const descriptionErrorText = searchState.query
    ? 'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
    : 'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'

  return (
    <Container accessibilityRole={AccessibilityRole.STATUS}>
      <ContainerNoOffer>
        <StyledNoOffer />
      </ContainerNoOffer>
      <ContainerText>
        <MainTitle>{mainTitle}</MainTitle>
        {searchState.query ? (
          <MainTitleComplement>{mainTitleComplement}</MainTitleComplement>
        ) : null}
        <DescriptionErrorTextContainer>
          <DescriptionErrorText accessibilityLiveRegion="assertive">
            {descriptionErrorText}
          </DescriptionErrorText>
        </DescriptionErrorTextContainer>
      </ContainerText>
      <Spacer.Column numberOfSpaces={6} />
      <View>
        <ButtonPrimary wording="Modifier mes filtres" onPress={onPressUpdateFilters} />
      </View>
    </Container>
  )
}

const ContainerNoOffer = styled.View(({ theme }) => ({
  flexShrink: 0,
  ...(theme.isMobileViewport && { marginTop: -(theme.tabBar.height + getSpacing(10)) }),
}))

const StyledNoOffer = styled(NoOffer).attrs(({ theme }) => ({
  size: theme.isDesktopViewport
    ? theme.illustrations.sizes.fullPage
    : theme.illustrations.sizes.medium,
  color: theme.colors.greyMedium,
}))``

const Container = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  ...(theme.isDesktopViewport ? {} : { marginHorizontal: getSpacing(6) }),
}))

const ContainerText = styled.View(({ theme }) => ({
  alignItems: 'center',
  ...(theme.isDesktopViewport
    ? {
        maxWidth: theme.contentPage.maxWidth,
      }
    : {}),
}))

const MainTitle = styled(Typo.Title4).attrs({
  ...getHeadingAttrs(2),
})(({ theme }) => ({
  color: theme.colors.black,
  marginTop: getSpacing(4),
}))

const MainTitleComplement = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.black,
}))

const DescriptionErrorText = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const DescriptionErrorTextContainer = styled(Typo.Body)({
  marginTop: getSpacing(6),
  textAlign: 'center',
})
