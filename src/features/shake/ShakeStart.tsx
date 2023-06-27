import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { IllustrationShake } from 'features/shake/IllustrationShakeSvg'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, Typo, Spacer } from 'ui/theme'

export const ShakeStart = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <Container>
      <Spacer.Flex />
      <IllustrationShake />
      <Spacer.Column numberOfSpaces={10} />
      <StyledTitle3>
        Bravo, en secouant ton téléphone tu as débloqué la sélection mystère&nbsp;!
      </StyledTitle3>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        Laisse-toi surprendre et découvre peut être ta prochaine sortie&nbsp;!
      </StyledBody>
      <Spacer.Flex />
      <ButtonPrimary wording="Découvrir la sélection" onPress={() => navigate('ShakeChoice')} />
      <Spacer.Column numberOfSpaces={3} />
      <InternalTouchableLink
        as={ButtonTertiaryBlack}
        wording="Plus tard"
        icon={ClockFilled}
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
