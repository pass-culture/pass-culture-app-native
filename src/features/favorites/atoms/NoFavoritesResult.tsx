import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const NoFavoritesResult: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <Container>
      <Spacer.Flex flex={2} />
      <EmptyFavorites />
      <DescriptionTextContainer>
        <DescriptionText>
          {_(t`Retrouve toutes tes offres en un clin d'oeil en les ajoutant à tes favoris !`)}
        </DescriptionText>
      </DescriptionTextContainer>
      <ButtonContainer>
        <ButtonPrimary title={_(t`Explorer les offres`)} onPress={() => navigate('Search')} />
      </ButtonContainer>
      <Spacer.Flex flex={5} />
    </Container>
  )
}

const Container = styled.View({
  flexGrow: 1,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: getSpacing(14.5),
})

const DescriptionText = styled(Typo.Body)({
  color: ColorsEnum.GREY_DARK,
})

const DescriptionTextContainer = styled.Text({
  marginTop: getSpacing(6.5),
  textAlign: 'center',
  flex: 1,
})

const ButtonContainer = styled.View({
  paddingHorizontal: getSpacing(6),
  flex: 1,
  width: '100%',
})
