import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/signup/nextSubscriptionStep'
import { StepButton } from 'features/identityCheck/atoms/StepButton'
import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
import { QuitIdentityCheckModal } from 'features/identityCheck/components/QuitIdentityCheckModal'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useIdentityCheckSteps } from 'features/identityCheck/useIdentityCheckSteps'
import { useSetCurrentSubscriptionStep } from 'features/identityCheck/useSetCurrentSubscriptionStep'
import { useGetStepState } from 'features/identityCheck/utils/useGetStepState'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { useModal } from 'ui/components/modals/useModal'
import { Background } from 'ui/svg/Background'
import { Spacer, Typo, ColorsEnum, getSpacing } from 'ui/theme'

export const IdentityCheckStepper = () => {
  const theme = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()
  const steps = useIdentityCheckSteps()
  const getStepState = useGetStepState()
  const context = useIdentityCheckContext()
  const { data: subscription } = useNextSubscriptionStep()
  useSetCurrentSubscriptionStep()

  const { visible, showModal, hideModal } = useModal(false)
  const {
    visible: isEduConnectModalVisible,
    showModal: showEduConnectModal,
    hideModal: hideEduConnectModal,
  } = useModal(false)

  useEffect(() => {
    if (context.step === null && steps[0])
      context.dispatch({ type: 'SET_STEP', payload: steps[0].name })
  }, [steps.length])

  function showQuitIdentityCheckModal() {
    if (context.step) analytics.logQuitIdentityCheck(context.step)
    showModal()
  }

  const shouldShowEduConnectModal = (
    step: StepConfig,
    allowedIdentityCheckMethods: IdentityCheckMethod[]
  ): boolean =>
    step.name === IdentityCheckStep.IDENTIFICATION &&
    allowedIdentityCheckMethods.includes(IdentityCheckMethod.Ubble) &&
    allowedIdentityCheckMethods.includes(IdentityCheckMethod.Educonnect)

  async function navigateToStep(step: StepConfig) {
    analytics.logIdentityCheckStep(step.name)

    if (shouldShowEduConnectModal(step, subscription?.allowedIdentityCheckMethods || [])) {
      showEduConnectModal()
    } else {
      navigate(step.screens[0])
    }
  }

  return (
    <React.Fragment>
      <CenteredContainer>
        <Background />
        <Container>
          <Spacer.TopScreen />
          {theme.isDesktopViewport ? <Spacer.Column numberOfSpaces={2} /> : <Spacer.Flex />}

          <Title>{t`C’est très rapide\u00a0!`}</Title>
          <Spacer.Column numberOfSpaces={2} />

          <StyledBody>{t`Voici les 3 étapes que tu vas devoir suivre.`}</StyledBody>
          {theme.isDesktopViewport ? <Spacer.Column numberOfSpaces={2} /> : <Spacer.Flex />}

          {steps.map((step) => (
            <StepButton
              key={step.name}
              step={step}
              state={getStepState(step.name)}
              onPress={() => navigateToStep(step)}
            />
          ))}

          {theme.isDesktopViewport ? (
            <Spacer.Column numberOfSpaces={10} />
          ) : (
            <Spacer.Flex flex={2} />
          )}

          <ButtonTertiaryWhite title={t`Abandonner`} onPress={showQuitIdentityCheckModal} />
        </Container>
      </CenteredContainer>
      <QuitIdentityCheckModal
        visible={visible}
        hideModal={hideModal}
        testIdSuffix="quit-identity-check-stepper"
      />
      <FastEduconnectConnectionRequestModal
        visible={isEduConnectModalVisible}
        hideModal={hideEduConnectModal}
      />
    </React.Fragment>
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
