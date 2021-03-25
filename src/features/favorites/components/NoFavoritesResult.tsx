import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'
import { AppButton } from 'ui/components/buttons/AppButton'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { ColorsEnum, getSpacing, Spacer, TAB_BAR_COMP_HEIGHT, Typo } from 'ui/theme'

export const NoFavoritesResult = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { dispatch } = useSearch()

  return (
    <Container>
      <Spacer.Flex />
      <EmptyFavorites size={197} color={ColorsEnum.GREY_MEDIUM} />
      <Explanation color={ColorsEnum.GREY_DARK}>
        {_(t`Retrouve toutes tes offres en un clin d'oeil en les ajoutant à tes favoris !`)}
      </Explanation>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonContainer>
        <AppButton
          title={_(t`Explorer les offres`)}
          onPress={() => {
            dispatch({ type: 'SHOW_RESULTS', payload: true })
            navigate('Search')
          }}
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
  textAlign: 'center',
})
