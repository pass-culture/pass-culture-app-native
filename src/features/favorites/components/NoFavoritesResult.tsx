import React from 'react'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchView } from 'features/search/types'
import { useLogBeforeNavToSearchResults } from 'features/search/utils/useLogBeforeNavToSearchResults'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NoFavoritesResult = () => {
  const onPressExploreOffers = useLogBeforeNavToSearchResults({ from: 'favorites' })
  const searchNavConfig = getTabNavConfig('Search', { view: SearchView.Landing })

  return (
    <Container>
      <Spacer.TabBar />
      <Spacer.Flex />
      <IconContainer>
        <StyledEmptyFavorites />
      </IconContainer>
      <StyledBody>
        Retrouve toutes tes offres en un clin d’oeil en les ajoutant à tes favoris&nbsp;!
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonContainer>
        <TouchableLink
          as={ButtonPrimary}
          navigateTo={{ screen: searchNavConfig[0], params: searchNavConfig[1] }}
          wording="Explorer les offres"
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
  marginBottom: theme.tabBar.height,
  padding: getSpacing(4),
}))

const ButtonContainer = styled.View({})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  flex: 1,
  flexGrow: 0,
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
