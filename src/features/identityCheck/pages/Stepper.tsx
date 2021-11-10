import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Spacer, Typo, ColorsEnum } from 'ui/theme'
import { useIdentityCheckSteps } from 'features/identityCheck/useIdentityCheckSteps'
import { StepButton } from 'features/identityCheck/atoms/StepButton'

export const IdentityCheckStepper = () => {
  const { goBack } = useGoBack(...homeNavConfig)
  const steps = useIdentityCheckSteps()

  return (
    <GenericInfoPage title={t`C’est très rapide !`}>
      <StyledBody>{t`Voici les 3 étapes que tu vas devoir suivre.`}</StyledBody>

      <Spacer.Column numberOfSpaces={6} />

      {/* TODO(antoinewg) dehardcode state. This is temporary for design purposes */}
      <StepButton key={steps[0].name} step={steps[0]} state="completed" />
      <StepButton key={steps[1].name} step={steps[1]} state="current" />
      <StepButton key={steps[2].name} step={steps[2]} state="disabled" />

      <Spacer.Column numberOfSpaces={12} />
      <ButtonTertiaryWhite title={t`Abandonner`} onPress={goBack} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({ color: ColorsEnum.WHITE })({
  textAlign: 'center',
})
