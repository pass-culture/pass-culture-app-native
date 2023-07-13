import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { BicolorNoOffer } from 'features/shake/BicolorNoOffer'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Typo, Spacer } from 'ui/theme'

export const ShakeNoRetry = () => {
  return (
    <Container>
      <Spacer.Flex />
      <BicolorNoOffer />
      <Spacer.Column numberOfSpaces={10} />
      <StyledTitle3>Tu as déjà découvert ta sélection du jour</StyledTitle3>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        Shake ton téléphone demain pour découvrir une nouvelle sélection mystère&nbsp;!
      </StyledBody>
      <Spacer.Flex />
      <InternalTouchableLink
        as={ButtonPrimary}
        wording="Retourner à l’accueil"
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
