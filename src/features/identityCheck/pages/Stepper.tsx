import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { MaintenancePageType, SubscriptionStep } from 'api/gen'
import { StepButton } from 'features/identityCheck/atoms/StepButton'
import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
import { QuitIdentityCheckModal } from 'features/identityCheck/components/QuitIdentityCheckModal'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useIdentityCheckSteps } from 'features/identityCheck/useIdentityCheckSteps'
import { useSetSubscriptionStepAndMethod } from 'features/identityCheck/useSetCurrentSubscriptionStep'
import { useGetStepState } from 'features/identityCheck/utils/useGetStepState'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { useModal } from 'ui/components/modals/useModal'
import { Background } from 'ui/svg/Background'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

export const IdentityCheckStepper = () => {
  const theme = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()
  const steps = useIdentityCheckSteps()
  const getStepState = useGetStepState()
  const context = useIdentityCheckContext()
  const { subscription } = useSetSubscriptionStepAndMethod()

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

  useEffect(() => {
    const showMaintenance = () => {
      if (subscription?.nextSubscriptionStep === SubscriptionStep.maintenance) {
        navigate('IdentityCheckUnavailable', {
          withDMS: subscription?.maintenancePageType === MaintenancePageType['with-dms'],
        })
      }
    }
    showMaintenance()
  }, [subscription])

  function showQuitIdentityCheckModal() {
    if (context.step) analytics.logQuitIdentityCheck(context.step)
    showModal()
  }

  async function navigateToStep(step: StepConfig) {
    analytics.logIdentityCheckStep(step.name)

    if (step.name === IdentityCheckStep.IDENTIFICATION && context.identification.method === null) {
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

          <VerticalUl>
            {steps.map((step) => (
              <Li key={step.name}>
                <StepButton
                  step={step}
                  state={getStepState(step.name)}
                  onPress={() => navigateToStep(step)}
                />
              </Li>
            ))}
          </VerticalUl>

          {theme.isDesktopViewport ? (
            <Spacer.Column numberOfSpaces={10} />
          ) : (
            <Spacer.Flex flex={2} />
          )}

          <ButtonTertiaryWhite wording={t`Abandonner`} onPress={showQuitIdentityCheckModal} />
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

const Title = styled(Typo.Title3).attrs(() => getHeadingAttrs(1))(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))

const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Container = styled.View(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  padding: getSpacing(5),
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))
