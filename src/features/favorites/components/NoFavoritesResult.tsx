import { t } from '@lingui/macro'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useNavigateToSearchResults } from 'features/search/utils/useNavigateToSearchResults'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { EmptyFavoritesDeprecated as EmptyFavorites } from 'ui/svg/icons/EmptyFavorites_deprecated'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NoFavoritesResult = () => {
  const { colors } = useTheme()
  const onPressExploreOffers = useNavigateToSearchResults({ from: 'favorites' })

  return (
    <Container>
      <Spacer.TabBar />
      <Spacer.Flex />
      <IconContainer>
        <EmptyFavorites size={197} color={colors.greyMedium} />
      </IconContainer>
      <Explanation>
        {t`Retrouve toutes tes offres en un clin d'oeil en les ajoutant à tes favoris\u00a0!`}
      </Explanation>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonContainer>
        <ButtonPrimary
          title={t`Explorer les offres`}
          onPress={onPressExploreOffers}
          buttonHeight="tall"
        />
      </ButtonContainer>
      <Spacer.Flex flex={2} />
    </Container>
  )
}

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
