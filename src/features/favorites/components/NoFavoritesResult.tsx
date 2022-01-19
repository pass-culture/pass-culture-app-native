import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useNavigateToSearchResults } from 'features/search/utils/useNavigateToSearchResults'
import { AppButton } from 'ui/components/buttons/AppButton'
import { EmptyFavoritesDeprecated as EmptyFavorites } from 'ui/svg/icons/EmptyFavorites_deprecated'
import { ColorsEnum, getSpacing, Spacer, TAB_BAR_COMP_HEIGHT, Typo } from 'ui/theme'

export const NoFavoritesResult = () => {
  const onPressExploreOffers = useNavigateToSearchResults({ from: 'favorites' })

  return (
    <Container>
      <Spacer.TabBar />
      <Spacer.Flex />
      <IconContainer>
        <EmptyFavorites size={197} color={ColorsEnum.GREY_MEDIUM} />
      </IconContainer>
      <Explanation color={ColorsEnum.GREY_DARK}>
        {t`Retrouve toutes tes offres en un clin d'oeil en les ajoutant à tes favoris\u00a0!`}
      </Explanation>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonContainer>
        <AppButton
          title={t`Explorer les offres`}
          onPress={onPressExploreOffers}
          textColor={ColorsEnum.WHITE}
          backgroundColor={ColorsEnum.PRIMARY}
          loadingIconColor={ColorsEnum.WHITE}
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

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: TAB_BAR_COMP_HEIGHT,
  padding: getSpacing(4),
})

const ButtonContainer = styled.View({
  maxWidth: getSpacing(44),
  width: '100%',
})

const Explanation = styled(Typo.Body)({
  flex: 1,
  flexGrow: 0,
  textAlign: 'center',
})
