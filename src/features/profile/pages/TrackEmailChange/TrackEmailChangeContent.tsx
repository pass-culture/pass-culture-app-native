import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Platform } from 'react-native'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { getEmailUpdateStep } from 'features/profile/helpers/getEmailUpdateStep'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { Step } from 'ui/components/Step/Step'
import { StepButton } from 'ui/components/StepButton/StepButton'
import { StepButtonState, StepDetails } from 'ui/components/StepButton/types'
import { StepList } from 'ui/components/StepList/StepList'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { PencilTip } from 'ui/svg/icons/bicolor/PencilTip'
import { BicolorEmailIcon } from 'ui/svg/icons/BicolorEmailIcon'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { Spacer } from 'ui/theme'

const isWeb = Platform.OS === 'web'

export const TrackEmailChangeContent = () => {
  const { replace, reset } = useNavigation<UseNavigationType>()

  const { user } = useAuthContext()
  const { data: requestStatus, isLoading: isRequestStatusLoading } = useEmailUpdateStatus()

  const hasPasswordStep = !user?.hasPassword || requestStatus?.hasRecentlyResetPassword
  const currentStep = getEmailUpdateStep(
    !!requestStatus?.hasRecentlyResetPassword,
    requestStatus?.status
  )
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
      subtitle: `Depuis l’e-mail envoyé à "${currentEmail}"`,
      icon: {
        current: BicolorEmailIcon,
        completed: CompletedEmailIcon,
        disabled: DisabledEmailIcon,
        retry: DisabledEmailIcon,
      },
      onPress: isWeb ? undefined : openInbox,
    },
    NEW_PASSWORD: {
      currentTitle: 'Crée ton mot de passe',
      defaultTitle: 'Création de ton mot de passe',
      subtitle: 'Pour pouvoir te connecter via ta future adresse e-mail',
      icon: {
        current: BicolorConfidentialityIcon,
        completed: CompletedConfidentialityIcon,
        disabled: DisabledConfidentialityIcon,
        retry: DisabledConfidentialityIcon,
      },
      navigateTo: getProfileNavConfig('ChangeEmailSetPassword', {
        token: requestStatus?.resetPasswordToken,
        emailSelectionToken: requestStatus?.token,
      }),
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
    replace(...homeNavConfig)
    return null
  }
  if (!isRequestStatusLoading && requestStatus?.expired) {
    reset({ index: 0, routes: [{ name: 'ChangeEmailExpiredLink' }] })
    return null
  }

  return (
    <StyledListContainer>
      <Spacer.Column numberOfSpaces={10} />
      <StepList currentStepIndex={currentStep}>
        {Object.entries(stepConfig)
          .filter(([key]) => (key === 'NEW_PASSWORD' ? hasPasswordStep : true))
          .map(([key, step], index) => {
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
}))({ transform: 'rotate(-8deg)' })

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
}))({ transform: 'rotate(-8deg)' })

const BicolorConfidentialityIcon = styled(Confidentiality).attrs(({ theme }) => ({
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``

const DisabledConfidentialityIcon = styled(Confidentiality).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
  color2: theme.colors.greyMedium,
}))``

const CompletedConfidentialityIcon = styled(Confidentiality).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  color2: theme.colors.greyDark,
}))({ transform: 'rotate(-8deg)' })

const StyledListContainer = styled.View({
  marginHorizontal: 'auto',
})
