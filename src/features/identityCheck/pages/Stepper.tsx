import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { MaintenancePageType, SubscriptionStep } from 'api/gen'
import { hasOngoingCredit } from 'features/home/services/useAvailableCredit'
import { StepButton } from 'features/identityCheck/atoms/StepButton'
import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
import { QuitIdentityCheckModal } from 'features/identityCheck/components/QuitIdentityCheckModal'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useSetSubscriptionStepAndMethod } from 'features/identityCheck/useSetCurrentSubscriptionStep'
import { useSubscriptionSteps } from 'features/identityCheck/useSubscriptionSteps'
import { getStepState } from 'features/identityCheck/utils/getStepState'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useUserProfileInfo } from 'features/profile/api'
import { analytics } from 'libs/firebase/analytics'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { Li } from 'ui/components/Li'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { VerticalUl } from 'ui/components/Ul'
import { BackgroundWithWhiteStatusBar } from 'ui/svg/Background'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const IdentityCheckStepper = () => {
  const theme = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()

  const steps = useSubscriptionSteps()
  const context = useSubscriptionContext()
  const currentStep = context.step

  const { subscription } = useSetSubscriptionStepAndMethod()
  const { showErrorSnackBar } = useSnackBarContext()
  const { refetch } = useUserProfileInfo()

  const { visible, showModal, hideModal } = useModal(false)
  const {
    visible: isEduConnectModalVisible,
    showModal: showEduConnectModal,
    hideModal: hideEduConnectModal,
  } = useModal(false)

  useEffect(() => {
    const showMaintenance = () => {
      if (subscription?.nextSubscriptionStep === SubscriptionStep.maintenance) {
        navigate('IdentityCheckUnavailable', {
          withDMS: subscription?.maintenancePageType === MaintenancePageType['with-dms'],
        })
      }
    }
    showMaintenance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription])

  function showQuitIdentityCheckModal() {
    if (context.step) analytics.logQuitIdentityCheck(context.step)
    showModal()
  }
  // TODO(yorickeando): this bit was done to ensure that DMS orphans did not have to go through the identity
  // check process twice if they submitted and validated through DMS before signing up on the app. In the future, after PC-14445,
  // we will prevent these users from even having to go through the Stepper process, so this extra navigation logic
  // can be removed.

  useEffect(() => {
    if (subscription?.nextSubscriptionStep === null) {
      refetch()
        .then(({ data: userProfile }) => {
          const hasUserOngoingCredit = userProfile ? hasOngoingCredit(userProfile) : false
          if (hasUserOngoingCredit) {
            navigate('BeneficiaryAccountCreated')
          }
        })
        .catch((error) => {
          showErrorSnackBar({
            message: extractApiErrorMessage(error),
            timeout: SNACK_BAR_TIME_OUT,
          })
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription])

  async function navigateToStep(step: StepConfig) {
    analytics.logIdentityCheckStep(step.name)

    if (step.name === IdentityCheckStep.IDENTIFICATION && context.identification.method === null) {
      showEduConnectModal()
    }
  }

  return (
    <React.Fragment>
      <CenteredContainer>
        <BackgroundWithWhiteStatusBar />
        <Container>
          <Spacer.TopScreen />
          {theme.isDesktopViewport ? <Spacer.Column numberOfSpaces={2} /> : <Spacer.Flex />}

          <StyledTitle3>C’est très rapide&nbsp;!</StyledTitle3>
          <Spacer.Column numberOfSpaces={2} />
          <StyledBody>Voici les {steps.length} étapes que tu vas devoir suivre</StyledBody>

          {theme.isDesktopViewport ? <Spacer.Column numberOfSpaces={2} /> : <Spacer.Flex />}

          <VerticalUl>
            {steps.map((step) => (
              <Li key={step.name}>
                <StepButton
                  step={step}
                  state={getStepState(steps, step.name, currentStep)}
                  navigateTo={
                    step.name === IdentityCheckStep.IDENTIFICATION &&
                    context.identification.method === null
                      ? undefined
                      : { screen: step.screens[0] }
                  }
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

          <ButtonTertiaryWhite
            icon={Invalidate}
            wording="Abandonner"
            onPress={showQuitIdentityCheckModal}
          />
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

const StyledTitle3 = styled(Typo.Title3).attrs(() => getHeadingAttrs(1))(({ theme }) => ({
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
