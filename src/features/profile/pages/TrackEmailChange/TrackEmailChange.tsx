import React, { useCallback } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { Step } from 'features/profile/components/Step/Step'
import { StepCard, StepCardType } from 'features/profile/components/StepCard/StepCard'
import { StepList } from 'features/profile/components/StepList/StepList'
import { BackButton } from 'ui/components/headers/BackButton'
import { BicolorEmailIcon } from 'ui/svg/icons/BicolorEmailIcon'
import { BicolorNewIcon } from 'ui/svg/icons/BicolorNewIcon'
import { BicolorPhoneIcon } from 'ui/svg/icons/BicolorPhoneIcon'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const HEADER_HEIGHT = getSpacing(8)

export function TrackEmailChange() {
  const currentStep = 1 // TODO(dbenfouzari): data should come from API

  const { user } = useAuthContext()
  const { top } = useCustomSafeInsets()
  const { goBack } = useGoBack(...homeNavConfig)

  const currentEmail = user?.email ?? ''

  const getStepCardType = useCallback(
    (stepIndex: number) => {
      if (stepIndex === currentStep) return StepCardType.ACTIVE
      if (stepIndex < currentStep) return StepCardType.DONE
      return StepCardType.DISABLED
    },
    [currentStep]
  )

  return (
    <StyledScrollViewContainer>
      <TopSpacer height={HEADER_HEIGHT + top} />
      <HeaderContainer>
        <Spacer.TopScreen />
        <GoBackContainer>
          <BackButton onGoBack={goBack} />
        </GoBackContainer>
      </HeaderContainer>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title1>Suivi de ton changement d’e-mail</Typo.Title1>
      <Spacer.Column numberOfSpaces={10} />
      <StyledContainer>
        <StyledStepList activeStepIndex={currentStep}>
          <Step>
            <StyledStepCard
              type={getStepCardType(0)}
              title="Envoie ta demande"
              icon={<BicolorPhoneIcon />}
            />
          </Step>
          <Step>
            <StyledStepCard
              type={getStepCardType(1)}
              title="Confirme ta demande"
              subtitle={currentStep === 1 ? `Depuis l’email envoyé à ${currentEmail}` : undefined}
              icon={<BicolorEmailIcon />}
            />
          </Step>
          <Step>
            <StyledStepCard
              type={getStepCardType(2)}
              title="Validation de ta nouvelle adresse"
              icon={<BicolorEmailIcon />}
            />
          </Step>
          <Step>
            <StyledStepCard
              type={getStepCardType(3)}
              title="Connexion sur ta nouvelle adresse"
              icon={<BicolorNewIcon />}
            />
          </Step>
        </StyledStepList>
      </StyledContainer>
    </StyledScrollViewContainer>
  )
}

const TopSpacer = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  zIndex: theme.zIndex.header,
  width: '100%',
  position: 'absolute',
  top: 0,
}))

const GoBackContainer = styled.View({
  justifyContent: 'center',
  height: HEADER_HEIGHT,
})

const StyledStepList = styled(StepList)({
  marginRight: getSpacing(3),
})

const StyledStepCard = styled(StepCard)({
  marginVertical: getSpacing(1),
  overflow: 'hidden',
})

const StyledScrollViewContainer = styled(ScrollView)({
  padding: getSpacing(6),
  overflow: 'hidden',
  flex: 1,
})

const StyledContainer = styled.View({
  maxWidth: 500,
})
