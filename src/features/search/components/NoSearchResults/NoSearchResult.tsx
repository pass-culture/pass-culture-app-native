import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const NoSearchResult: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const query = params?.query

  useEffect(() => {
    if (query) {
      analytics.logNoSearchResult(query, params?.searchId)
    }
  }, [params?.searchId, query])

  const onPressUpdateFilters = useCallback(() => {
    navigate('SearchFilter')
  }, [navigate])

  const mainTitle = 'Pas de résultat'
  const mainTitleComplement = `pour "${query}"`
  const descriptionErrorText = query
    ? 'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
    : 'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'

  return (
    <Container accessibilityRole={AccessibilityRole.STATUS}>
      <Spacer.Flex />
      <ContainerNoOffer>
        <StyledNoOffer />
      </ContainerNoOffer>
      <ContainerText>
        <MainTitle>{mainTitle}</MainTitle>
        {!!query && <MainTitleComplement>{mainTitleComplement}</MainTitleComplement>}
        <DescriptionErrorTextContainer>
          <DescriptionErrorText aria-live="assertive">{descriptionErrorText}</DescriptionErrorText>
        </DescriptionErrorTextContainer>
      </ContainerText>
      <Spacer.Column numberOfSpaces={6} />
      <View>
        <ButtonPrimary wording="Modifier mes filtres" onPress={onPressUpdateFilters} />
      </View>
      <Spacer.Flex />
    </Container>
  )
}

const ContainerNoOffer = styled.View({
  flexShrink: 0,
})

const StyledNoOffer = styled(NoOffer).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.colors.greyMedium,
}))``

const Container = styled.View(({ theme }) => ({
  flex: 1,
  minHeight: 250,
  height: '100%',
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
