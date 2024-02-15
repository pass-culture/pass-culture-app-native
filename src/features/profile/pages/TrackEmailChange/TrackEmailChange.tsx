import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Platform, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { UpdateAppBanner } from 'features/profile/components/Banners/UpdateAppBanner'
import { Step } from 'features/profile/components/Step/Step'
import { StepCard, StepCardType } from 'features/profile/components/StepCard/StepCard'
import { StepList } from 'features/profile/components/StepList/StepList'
import { getEmailUpdateStep } from 'features/profile/helpers/getEmailUpdateStep'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BackButton } from 'ui/components/headers/BackButton'
import { BicolorEmailIcon } from 'ui/svg/icons/BicolorEmailIcon'
import { BicolorNewIcon } from 'ui/svg/icons/BicolorNewIcon'
import { BicolorPhoneIcon } from 'ui/svg/icons/BicolorPhoneIcon'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const HEADER_HEIGHT = getSpacing(8)

export function TrackEmailChange() {
  const disableOldChangeEmail = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_OLD_CHANGE_EMAIL)
  const { data: emailUpdateStatus, isLoading } = useEmailUpdateStatus()
  const { user } = useAuthContext()
  const { top } = useCustomSafeInsets()
  const { goBack } = useGoBack(...homeNavConfig)
  const { navigate } = useNavigation<UseNavigationType>()

  const currentStep = useMemo(
    () => getEmailUpdateStep(emailUpdateStatus?.status),
    [emailUpdateStatus?.status]
  )
  const currentEmail = user?.email ?? ''
  const newEmail = emailUpdateStatus?.newEmail ?? ''

  const getStepCardType = useCallback(
    (stepIndex: number) => {
      if (disableOldChangeEmail) return StepCardType.DISABLED
      if (stepIndex === currentStep) return StepCardType.ACTIVE
      if (stepIndex < currentStep) return StepCardType.DONE
      return StepCardType.DISABLED
    },
    [currentStep, disableOldChangeEmail]
  )

  useEffect(() => {
    if (!isLoading) {
      if (!emailUpdateStatus) {
        navigateToHome()
      }
      if (emailUpdateStatus?.expired) {
        navigate('ChangeEmailExpiredLink')
      }
    }
  }, [emailUpdateStatus, isLoading, navigate])

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
      <StyledTitleText>Suivi de ton changement d’e-mail</StyledTitleText>
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
        <StyledStepList activeStepIndex={currentStep}>
          <Step>
            <StyledStepCard
              type={getStepCardType(0)}
              title="Envoi de ta demande"
              icon={<BicolorPhoneIcon />}
            />
          </Step>
          <Step>
            <StyledStepCard
              type={getStepCardType(1)}
              title={currentStep === 1 ? 'Confirme ta demande' : 'Confirmation de ta demande'}
              subtitle={`Depuis l’email envoyé à ${currentEmail}`}
              icon={<BicolorEmailIcon />}
            />
          </Step>
          <Step>
            <StyledStepCard
              type={getStepCardType(2)}
              title={
                currentStep === 2
                  ? 'Valide ta nouvelle adresse'
                  : 'Validation de ta nouvelle adresse'
              }
              subtitle={`Depuis l’email envoyé à ${newEmail}`}
              icon={<BicolorEmailIcon />}
            />
          </Step>
          <Step>
            <StyledStepCard
              type={getStepCardType(3)}
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

const StyledListContainer = styled.View({
  marginHorizontal: 'auto',
})

const StyledTitleText = styled(Typo.Title1)({
  ...(Platform.OS === 'web' ? { textAlign: 'center' } : {}),
})
