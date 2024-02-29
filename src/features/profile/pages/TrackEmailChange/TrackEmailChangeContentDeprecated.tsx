import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { UpdateAppBanner } from 'features/profile/components/Banners/UpdateAppBanner'
import { StepCard } from 'features/profile/components/StepCard/StepCard'
import { getEmailUpdateStep } from 'features/profile/helpers/getEmailUpdateStep'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Step } from 'ui/components/Step/Step'
import { StepButtonState } from 'ui/components/StepButton/types'
import { StepList } from 'ui/components/StepList/StepList'
import { BicolorEmailIcon } from 'ui/svg/icons/BicolorEmailIcon'
import { BicolorNewIcon } from 'ui/svg/icons/BicolorNewIcon'
import { BicolorPhoneIcon } from 'ui/svg/icons/BicolorPhoneIcon'
import { getSpacing, Spacer } from 'ui/theme'

export const TrackEmailChangeContentDeprecated = () => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const disableOldChangeEmail = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_OLD_CHANGE_EMAIL)
  const { data: emailUpdateStatus, isLoading } = useEmailUpdateStatus()
  const { user } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()

  const currentStep = useMemo(
    () => getEmailUpdateStep(emailUpdateStatus?.status),
    [emailUpdateStatus?.status]
  )
  const currentEmail = user?.email ?? ''
  const newEmail = emailUpdateStatus?.newEmail ?? ''

  const getStepButtonState = useCallback(
    (stepIndex: number) => {
      if (disableOldChangeEmail) return StepButtonState.DISABLED
      if (stepIndex === currentStep) return StepButtonState.CURRENT
      if (stepIndex < currentStep) return StepButtonState.DISABLED
      return StepButtonState.DISABLED
    },
    [currentStep, disableOldChangeEmail]
  )

  useEffect(() => {
    if (!isLoading) {
      if (!emailUpdateStatus) {
        timeoutRef.current = setTimeout(() => navigateToHome(), 500)
      }
      if (emailUpdateStatus?.expired) {
        timeoutRef.current = setTimeout(() => navigate('ChangeEmailExpiredLink'), 500)
      }
    }

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [emailUpdateStatus, isLoading, navigate])

  return (
    <StyledListContainer>
      {disableOldChangeEmail ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <UpdateAppBanner />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      ) : (
        <Spacer.Column numberOfSpaces={10} />
      )}
      <StyledStepList currentStepIndex={currentStep}>
        <Step>
          <StyledStepCard
            type={getStepButtonState(0)}
            title="Envoi de ta demande"
            icon={<BicolorPhoneIcon />}
          />
        </Step>
        <Step>
          <StyledStepCard
            type={getStepButtonState(1)}
            title={currentStep === 1 ? 'Confirme ta demande' : 'Confirmation de ta demande'}
            subtitle={`Depuis l’email envoyé à ${currentEmail}`}
            icon={<BicolorEmailIcon />}
          />
        </Step>
        <Step>
          <StyledStepCard
            type={getStepButtonState(2)}
            title={
              currentStep === 2 ? 'Valide ta nouvelle adresse' : 'Validation de ta nouvelle adresse'
            }
            subtitle={`Depuis l’email envoyé à ${newEmail}`}
            icon={<BicolorEmailIcon />}
          />
        </Step>
        <Step>
          <StyledStepCard
            type={getStepButtonState(3)}
            title={
              currentStep === 3
                ? 'Connecte-toi sur ta nouvelle adresse'
                : 'Connexion sur ta nouvelle adresse'
            }
            icon={<BicolorNewIcon />}
          />
        </Step>
      </StyledStepList>
    </StyledListContainer>
  )
}

const StyledStepList = styled(StepList)({
  marginRight: getSpacing(3),
})

const StyledStepCard = styled(StepCard)({
  marginVertical: getSpacing(1),
  overflow: 'hidden',
})

const StyledListContainer = styled.View({
  marginHorizontal: 'auto',
})
