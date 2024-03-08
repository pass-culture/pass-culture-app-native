import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Platform } from 'react-native'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getEmailUpdateStepV2 } from 'features/profile/helpers/getEmailUpdateStepV2'
import { useEmailUpdateStatusV2 } from 'features/profile/helpers/useEmailUpdateStatusV2'
import { Step } from 'ui/components/Step/Step'
import { StepButton } from 'ui/components/StepButton/StepButton'
import { StepButtonState, StepDetails } from 'ui/components/StepButton/types'
import { StepList } from 'ui/components/StepList/StepList'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { PencilTip } from 'ui/svg/icons/bicolor/PencilTip'
import { BicolorEmailIcon } from 'ui/svg/icons/BicolorEmailIcon'
import { Spacer } from 'ui/theme'

const isWeb = Platform.OS === 'web'

export const TrackEmailChangeContent = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const { user } = useAuthContext()
  const { data: requestStatus, isLoading: isRequestStatusLoading } = useEmailUpdateStatusV2()

  const currentStep = getEmailUpdateStepV2(requestStatus?.status)
  const currentEmail = user?.email ?? ''
  const newEmail = requestStatus?.newEmail ?? ''

  const getStepButtonState = useCallback(
    (stepIndex: number) => {
      if (stepIndex === currentStep) return StepButtonState.CURRENT
      if (stepIndex < currentStep) return StepButtonState.COMPLETED
      return StepButtonState.DISABLED
    },
    [currentStep]
  )

  const stepConfig: Record<
    string,
    {
      currentTitle: string
      defaultTitle: string
      subtitle: string
      icon: StepDetails['icon']
      onPress?: () => void
      navigateTo?: InternalNavigationProps['navigateTo']
    }
  > = {
    CONFIRMATION: {
      currentTitle: 'Confirme ta demande',
      defaultTitle: 'Confirmation de ta demande',
      subtitle: `Depuis l’email envoyé à "${currentEmail}"`,
      icon: {
        current: BicolorEmailIcon,
        completed: CompletedEmailIcon,
        disabled: DisabledEmailIcon,
        retry: DisabledEmailIcon,
      },
      onPress: isWeb ? undefined : openInbox,
    },
    NEW_EMAIL: {
      currentTitle: 'Choisis ta nouvelle adresse e-mail',
      defaultTitle: 'Choix de ta nouvelle adresse e-mail',
      subtitle: 'Renseigne ta nouvelle adresse e-mail',
      icon: {
        current: BicolorPencilIcon,
        completed: CompletedPencilIcon,
        disabled: DisabledPencilIcon,
        retry: DisabledPencilIcon,
      },
      navigateTo: { screen: 'NewEmailSelection', params: { token: requestStatus?.token } },
    },
    VALIDATION: {
      currentTitle: 'Valide ta nouvelle adresse',
      defaultTitle: 'Validation de ta nouvelle adresse e-mail',
      subtitle: `Depuis l’email envoyé à "${newEmail}"`,
      icon: {
        current: BicolorEmailIcon,
        completed: CompletedEmailIcon,
        disabled: DisabledEmailIcon,
        retry: DisabledEmailIcon,
      },
      onPress: isWeb ? undefined : openInbox,
    },
  }

  if (!isRequestStatusLoading && !requestStatus?.status) {
    navigateToHome()
    return null
  }
  if (!isRequestStatusLoading && requestStatus?.expired) {
    navigate('ChangeEmailExpiredLink')
    return null
  }

  return (
    <StyledListContainer>
      <Spacer.Column numberOfSpaces={10} />
      <StepList currentStepIndex={currentStep}>
        {Object.entries(stepConfig).map(([key, step], index) => {
          const stepState = getStepButtonState(index)
          const isCurrent = stepState === StepButtonState.CURRENT

          return (
            <Step key={key}>
              {isCurrent ? <Spacer.Column numberOfSpaces={2} /> : null}
              <StepButton
                step={{
                  stepState,
                  title: isCurrent ? step.currentTitle : step.defaultTitle,
                  subtitle: isCurrent ? step.subtitle : undefined,
                  icon: step.icon,
                }}
                onPress={step?.onPress}
                navigateTo={step?.navigateTo}
              />
            </Step>
          )
        })}
      </StepList>
    </StyledListContainer>
  )
}

const DisabledEmailIcon = styled(BicolorEmailIcon).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
  color2: theme.colors.greyMedium,
}))``

const CompletedEmailIcon = styled(BicolorEmailIcon).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  color2: theme.colors.greyDark,
}))``

const BicolorPencilIcon = styled(PencilTip).attrs(({ theme }) => ({
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``

const DisabledPencilIcon = styled(PencilTip).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
  color2: theme.colors.greyMedium,
}))``

const CompletedPencilIcon = styled(PencilTip).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  color2: theme.colors.greyDark,
}))``

const StyledListContainer = styled.View({
  marginHorizontal: 'auto',
})
