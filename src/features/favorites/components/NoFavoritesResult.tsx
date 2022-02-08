import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useNavigateToSearchResults } from 'features/search/utils/useNavigateToSearchResults'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NoFavoritesResult = () => {
  const onPressExploreOffers = useNavigateToSearchResults({ from: 'favorites' })

  return (
    <Container>
      <Spacer.TabBar />
      <Spacer.Flex />
      <IconContainer>
        <StyledEmptyFavorites />
      </IconContainer>
      <Explanation>
        {t`Retrouve toutes tes offres en un clin d'oeil en les ajoutant à tes favoris\u00a0!`}
      </Explanation>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonContainer>
        <ButtonPrimary
          wording={t`Explorer les offres`}
          onPress={onPressExploreOffers}
          buttonHeight="tall"
        />
      </ButtonContainer>
      <Spacer.Flex flex={2} />
    </Container>
  )
}
const StyledEmptyFavorites = styled(EmptyFavorites).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.colors.greyMedium,
}))``

const IconContainer = styled.View({
  flex: 1,
  minHeight: 80,
})

const Container = styled.View(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.tabBarHeight,
  padding: getSpacing(4),
}))

const ButtonContainer = styled.View({
  maxWidth: getSpacing(44),
  width: '100%',
})

const Explanation = styled(Typo.Body)(({ theme }) => ({
  flex: 1,
  flexGrow: 0,
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
