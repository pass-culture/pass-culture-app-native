import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'
import { AppButton } from 'ui/components/buttons/AppButton'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const NoFavoritesResult = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { dispatch } = useSearch()

  return (
    <Container>
      <Spacer.TopScreen />
      <Spacer.Flex />
      <EmptyFavorites color={ColorsEnum.GREY_MEDIUM} />
      <Spacer.Column numberOfSpaces={2} />

      <CenteredContainer>
        <TextContainer>
          <CenteredText>
            <Typo.Body color={ColorsEnum.GREY_DARK}>
              {_(t`Retrouve toutes tes offres en un clin d'oeil en les ajoutant à tes favoris !`)}
            </Typo.Body>
          </CenteredText>
        </TextContainer>
      </CenteredContainer>

      <Row>
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
      </Row>
      <Spacer.Flex flex={3} />
      <Spacer.BottomScreen />
    </Container>
  )
}

const Container = styled.View({
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
})

const Row = styled.View({ flexDirection: 'row' })

const CenteredContainer = styled.View({
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginHorizontal: getSpacing(8),
})

const ButtonContainer = styled.View({ flex: 1, maxWidth: getSpacing(44) })
const TextContainer = styled.View({ maxWidth: getSpacing(88) })

const CenteredText = styled.Text({
  textAlign: 'center',
})
