import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { MaintenancePageType, SubscriptionStep } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useShowDisableActivation } from 'features/forceUpdate/helpers/useShowDisableActivation'
import { QuitIdentityCheckModal } from 'features/identityCheck/components/modals/QuitIdentityCheckModal'
import { useRehydrateProfile } from 'features/identityCheck/pages/helpers/useRehydrateProfile'
import { useSetSubscriptionStepAndMethod } from 'features/identityCheck/pages/helpers/useSetCurrentSubscriptionStep'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { hasOngoingCredit } from 'shared/user/useAvailableCredit'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { StepButton } from 'ui/components/StepButton/StepButton'
import { StepButtonState } from 'ui/components/StepButton/types'
import { StepList } from 'ui/components/StepList/StepList'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Page } from 'ui/pages/Page'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const Stepper = () => {
  useShowDisableActivation()

  const { isDesktopViewport } = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Stepper'>>()

  const {
    stepsDetails: steps,
    title: stepperTitle,
    subtitle: stepperSubtitle,
    errorMessage,
  } = useStepperInfo()

  const currentStepIndex = steps.findIndex(
    (step) => step.stepState === StepButtonState.CURRENT || step.stepState === StepButtonState.RETRY
  )
  const stepToComplete = steps[currentStepIndex]

  const { subscription } = useSetSubscriptionStepAndMethod()
  const { showErrorSnackBar } = useSnackBarContext()
  const { refetchUser } = useAuthContext()
  useRehydrateProfile()

  const { visible, showModal: showQuitIdentityCheckModal, hideModal } = useModal(false)

  useEffect(() => {
    const showMaintenance = () => {
      if (subscription?.nextSubscriptionStep === SubscriptionStep.maintenance) {
        navigate(
          ...getSubscriptionHookConfig('IdentityCheckUnavailable', {
            withDMS: subscription?.maintenancePageType === MaintenancePageType['with-dms'],
          })
        )
      }
    }
    showMaintenance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription])

  useEffect(() => {
    if (subscription?.nextSubscriptionStep === null) {
      refetchUser()
        .then(({ data: userProfile }) => {
          const hasUserOngoingCredit = userProfile ? hasOngoingCredit(userProfile) : false
          if (hasUserOngoingCredit) {
            navigate(...getSubscriptionHookConfig('BeneficiaryAccountCreated'))
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

  useEffect(() => {
    if (params?.from && stepToComplete?.name) {
      analytics.logStepperDisplayed(params.from, stepToComplete.name)
    }
  }, [params?.from, stepToComplete?.name])

  const stepList = (
    <StepList currentStepIndex={currentStepIndex}>
      {steps.map((step, index) => (
        <StepButtonContainer key={step.name}>
          <StepButton
            step={step}
            navigateTo={getSubscriptionPropConfig(step.firstScreen, {
              type: step.firstScreenType,
            })}
            onPress={() => {
              analytics.logIdentityCheckStep(step.name)
            }}
          />
          {index === steps.length - 1 ? null : <Spacer.Column numberOfSpaces={2} />}
        </StepButtonContainer>
      ))}
    </StepList>
  )

  return (
    <Page>
      <Container>
        <Spacer.TopScreen />
        {isDesktopViewport ? (
          <Spacer.Column numberOfSpaces={16} />
        ) : (
          <Spacer.Column numberOfSpaces={4} />
        )}

        <StyledTitle1>{stepperTitle}</StyledTitle1>
        <Spacer.Column numberOfSpaces={2} />
        {stepperSubtitle ? <StyledSubtitle subtitle={stepperSubtitle} /> : null}
        {errorMessage ? <StyledErrorMessage errorMessage={errorMessage} /> : null}
        <Spacer.Column numberOfSpaces={2} />
        {stepList}
        <Spacer.Flex flex={1} />

        <QuitButtonContainer>
          <ButtonTertiaryBlack
            icon={Invalidate}
            wording="Abandonner"
            onPress={showQuitIdentityCheckModal}
            accessibilityRole={AccessibilityRole.BUTTON}
          />
        </QuitButtonContainer>
      </Container>
      <QuitIdentityCheckModal
        visible={visible}
        hideModal={hideModal}
        testIdSuffix="quit-identity-check-stepper"
      />
    </Page>
  )
}

const StyledTitle1 = styled(Typo.Title1).attrs(() => getHeadingAttrs(1))``

const Container = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.designSystem.size.spacing.xl,
    paddingBottom: theme.designSystem.size.spacing.xxxl,
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
  },
}))``

const StepButtonContainer = styled.View({
  alignItems: 'center',
})

const QuitButtonContainer = styled.View({
  justifyContent: 'center',
  minHeight: getSpacing(15),
})

const StyledSubtitle = ({ subtitle }: { subtitle: string }) => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Body>{subtitle}</Typo.Body>
    <Spacer.Column numberOfSpaces={8} />
  </React.Fragment>
)

const StyledErrorMessage = ({ errorMessage }: { errorMessage: string }) => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={4} />
    <Banner type={BannerType.ERROR} label={errorMessage} />
  </React.Fragment>
)
