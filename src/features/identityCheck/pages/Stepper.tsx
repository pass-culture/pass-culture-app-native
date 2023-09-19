import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { MaintenancePageType, SubscriptionStep } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ErrorBanner } from 'features/identityCheck/components/ErrorBanner'
import { QuitIdentityCheckModal } from 'features/identityCheck/components/modals/QuitIdentityCheckModal'
import { StepButton } from 'features/identityCheck/components/StepButton'
import { useRehydrateProfile } from 'features/identityCheck/pages/helpers/useRehydrateProfile'
import { useSetSubscriptionStepAndMethod } from 'features/identityCheck/pages/helpers/useSetCurrentSubscriptionStep'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { StepButtonState } from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { StepList } from 'features/profile/components/StepList/StepList'
import { analytics } from 'libs/analytics'
import { hasOngoingCredit } from 'shared/user/useAvailableCredit'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const Stepper = () => {
  const theme = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()

  const {
    stepsDetails: steps,
    title: stepperTitle,
    subtitle: stepperSubtitle,
    errorMessage,
  } = useStepperInfo()

  const activeStepIndex = steps.findIndex(
    (step) => step.stepState === StepButtonState.CURRENT || step.stepState === StepButtonState.RETRY
  )

  const { subscription } = useSetSubscriptionStepAndMethod()
  const { showErrorSnackBar } = useSnackBarContext()
  const { refetchUser } = useAuthContext()
  useRehydrateProfile()

  const { visible, showModal: showQuitIdentityCheckModal, hideModal } = useModal(false)

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

  // TODO(yorickeando): this bit was done to ensure that DMS orphans did not have to go through the identity
  // check process twice if they submitted and validated through DMS before signing up on the app. In the future, after PC-14445,
  // we will prevent these users from even having to go through the Stepper process, so this extra navigation logic
  // can be removed.
  useEffect(() => {
    if (subscription?.nextSubscriptionStep === null) {
      refetchUser()
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

  const stepList = (
    <StepList activeStepIndex={activeStepIndex}>
      {steps.map((step, index) => (
        <StepButtonContainer key={step.name}>
          <StepButton
            step={step}
            navigateTo={{ screen: step.firstScreen }}
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
    <React.Fragment>
      <Container>
        <Spacer.TopScreen />
        {theme.isDesktopViewport ? (
          <Spacer.Column numberOfSpaces={16} />
        ) : (
          <Spacer.Column numberOfSpaces={4} />
        )}

        <StyledTitle1>{stepperTitle}</StyledTitle1>
        <Spacer.Column numberOfSpaces={2} />
        {!!stepperSubtitle && <StyledSubtitle subtitle={stepperSubtitle} />}
        {!!errorMessage && <StyledErrorMessage errorMessage={errorMessage} />}
        <Spacer.Column numberOfSpaces={2} />
        {stepList}
        <Spacer.Flex flex={1} />

        <ButtonTertiaryBlack
          icon={Invalidate}
          wording="Abandonner"
          onPress={showQuitIdentityCheckModal}
        />
      </Container>
      <QuitIdentityCheckModal
        visible={visible}
        hideModal={hideModal}
        testIdSuffix="quit-identity-check-stepper"
      />
    </React.Fragment>
  )
}

const StyledTitle1 = styled(Typo.Title1).attrs(() => getHeadingAttrs(1))``

const Container = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: getSpacing(6),
    paddingBottom: getSpacing(9),
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
}))``

const StepButtonContainer = styled.View({
  alignItems: 'center',
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
    <ErrorBanner message={errorMessage} />
  </React.Fragment>
)
