import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { IllustrationShake } from 'features/shake/IllustrationShakeSvg'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { getSpacing, Typo, Spacer } from 'ui/theme'

export const ShakeEndWithFavorite = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <Container>
      <Spacer.Flex />
      <IllustrationShake />
      <Spacer.Column numberOfSpaces={10} />
      <StyledTitle3>C’est tout pour aujourd’hui&nbsp;!</StyledTitle3>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        Shake ton téléphone demain pour découvrir une nouvelle sélection mystère&nbsp;!
      </StyledBody>
      <Spacer.Flex />
      <ButtonPrimary wording="Voir mes favoris" onPress={() => navigate('FavoritesSorts')} />
      <Spacer.Column numberOfSpaces={3} />
      <InternalTouchableLink
        as={ButtonTertiaryPrimary}
        wording="Retourner à l’accueil"
        icon={PlainArrowPrevious}
        navigateTo={navigateToHomeConfig}
      />
      <Spacer.Column numberOfSpaces={3} />
      <Spacer.BottomScreen />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
  margin: getSpacing(6),
})

const StyledTitle3 = styled(Typo.Title3)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
