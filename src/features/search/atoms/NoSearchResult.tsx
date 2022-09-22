import { useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { usePushWithStagedSearch } from 'features/search/pages/usePushWithStagedSearch'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NoSearchResult: React.FC = () => {
  const { position } = useGeolocation()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const query = params?.query
  const pushWithStagedSearch = usePushWithStagedSearch()

  useEffect(() => {
    if (query) {
      analytics.logNoSearchResult(query)
    }
  }, [query])

  const handlePressAroundMe = useCallback(() => {
    pushWithStagedSearch(
      {
        locationFilter: position
          ? {
              locationType: LocationType.AROUND_ME,
              aroundRadius: MAX_RADIUS,
            }
          : { locationType: LocationType.EVERYWHERE },
        view: SearchView.Landing,
      },
      { reset: true }
    )
  }, [position, pushWithStagedSearch])

  const mainTitle = 'Pas de résultat'
  const mainTitleComplement = `pour "${query}"`
  const descriptionErrorText = query
    ? 'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
    : 'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
  const descriptionErrorTextContinuation = 'Découvre toutes les offres'

  return (
    <Container>
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
        <DescriptionErrorTextContainer>
          <DescriptionErrorText>
            {descriptionErrorTextContinuation}
            <Spacer.Row numberOfSpaces={1} />
            <ButtonInsideText wording="autour de toi" onPress={handlePressAroundMe} />
          </DescriptionErrorText>
        </DescriptionErrorTextContainer>
      </ContainerText>
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

const MainTitle = styled(Typo.Title4)(({ theme }) => ({
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
  marginTop: getSpacing(6.5),
  textAlign: 'center',
})
