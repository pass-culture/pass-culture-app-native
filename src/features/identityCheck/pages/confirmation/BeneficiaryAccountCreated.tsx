import React, { useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { creditActions } from 'features/identityCheck/api/useCreditStore'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { useAnimationToDisplay } from 'libs/styled/useAnimationToDisplay'
import { useResetRecreditAmountToShowMutation } from 'queries/profile/useResetRecreditAmountToShowMutation'
import { defaultCreditByAge } from 'shared/credits/defaultCreditByAge'
import { useShouldShowCulturalSurveyForBeneficiaryUser } from 'shared/culturalSurvey/useShouldShowCulturalSurveyForBeneficiaryUser'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { categoriesIcons } from 'ui/svg/icons/exports/categoriesIcons'
import { Typo, getSpacing } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export function BeneficiaryAccountCreated() {
  // TODO(PC-36293): use TutorialPassLogoDark and TutorialPassLogoLight
  const animation = useAnimationToDisplay({
    light: TutorialPassLogo,
    dark: TutorialPassLogo,
  })

  const { designSystem } = useTheme()
  const { user, refetchUser } = useAuthContext()

  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const shouldShowCulturalSurvey = useShouldShowCulturalSurveyForBeneficiaryUser()
  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)
  const { showShareAppModal } = useShareAppContext()

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const fallbackAmount = isUnderageBeneficiary
    ? defaultCreditByAge.age_17
    : defaultCreditByAge.age_18
  const recreditAmount = formatCurrencyFromCents(
    user?.recreditAmountToShow || fallbackAmount,
    currency,
    euroToPacificFrancRate
  )
  const subtitle = `${recreditAmount} viennent d’être crédités sur ton compte pass Culture`

  const { mutate: resetRecreditAmountToShow } = useResetRecreditAmountToShowMutation({
    onSuccess: () => {
      refetchUser()
    },
  })

  const onBeforeNavigate = useCallback(() => {
    BatchProfile.trackEvent(BatchEvent.hasValidatedSubscription)
    if (!user?.needsToFillCulturalSurvey) showShareAppModal(ShareAppModalType.BENEFICIARY)
    creditActions.setActivationDate(new Date())
    resetRecreditAmountToShow()
  }, [resetRecreditAmountToShow, showShareAppModal, user?.needsToFillCulturalSurvey])

  useEnterKeyAction(navigateToHome)

  return (
    <GenericInfoPage
      animation={animation}
      title="Bonne nouvelle&nbsp;!"
      subtitle={subtitle}
      buttonPrimary={{
        wording: 'C’est parti\u00a0!',
        onBeforeNavigate: onBeforeNavigate,
        navigateTo: shouldNavigateToCulturalSurvey
          ? { screen: 'CulturalSurveyIntro' }
          : navigateToHomeConfig,
      }}>
      <ProgressBarContainer>
        <AnimatedProgressBar
          progress={1}
          color={designSystem.color.background.brandPrimary}
          icon={categoriesIcons.Show}
          isAnimated
        />
        <Amount>{recreditAmount}</Amount>
      </ProgressBarContainer>
      <StyledBody>Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
  marginTop: getSpacing(4),
})

const ProgressBarContainer = styled.View({
  paddingHorizontal: getSpacing(10),
})

const Amount = styled(Typo.Title2).attrs(getNoHeadingAttrs())(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.brandPrimary,
}))
