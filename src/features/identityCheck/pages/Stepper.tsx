import { t } from '@lingui/macro'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { StepButton } from 'features/identityCheck/atoms/StepButton'
import { useIdentityCheckSteps } from 'features/identityCheck/useIdentityCheckSteps'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { Background } from 'ui/svg/Background'
import { Spacer, Typo, ColorsEnum, getSpacing } from 'ui/theme'

export const IdentityCheckStepper = () => {
  const theme = useTheme()
  const { goBack } = useGoBack(...homeNavConfig)
  const steps = useIdentityCheckSteps()

  return (
    <CenteredContainer>
      <Background />
      <Container>
        <Spacer.TopScreen />
        {theme.isDesktopViewport ? <Spacer.Column numberOfSpaces={2} /> : <Spacer.Flex />}

        <Title>{t`C’est très rapide !`}</Title>
        <Spacer.Column numberOfSpaces={2} />

        <StyledBody>{t`Voici les 3 étapes que tu vas devoir suivre.`}</StyledBody>
        {theme.isDesktopViewport ? <Spacer.Column numberOfSpaces={2} /> : <Spacer.Flex />}

        {/* TODO(antoinewg) dehardcode state. This is temporary for design purposes */}
        <StepButton key={steps[0].name} step={steps[0]} state="completed" />
        <StepButton key={steps[1].name} step={steps[1]} state="current" />
        <StepButton key={steps[2].name} step={steps[2]} state="disabled" />
        {theme.isDesktopViewport ? <Spacer.Column numberOfSpaces={10} /> : <Spacer.Flex flex={2} />}

        <ButtonTertiaryWhite title={t`Abandonner`} onPress={goBack} />
      </Container>
    </CenteredContainer>
  )
}

const Title = styled(Typo.Title3).attrs({ color: ColorsEnum.WHITE })({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body).attrs({ color: ColorsEnum.WHITE })({
  textAlign: 'center',
})

const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  padding: getSpacing(5),
  width: '100%',
  maxWidth: getSpacing(125),
})
