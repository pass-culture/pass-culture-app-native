import React, { useCallback, useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { isFastCreditCandidate } from 'libs/reviewInApp/creditReviewTrigger'
import { CREDIT_REVIEW_DELAY_MS } from 'libs/reviewInApp/types'
import { useReviewInApp } from 'libs/reviewInApp/useReviewInApp'
import { useResetRecreditAmountToShowMutation } from 'queries/profile/useResetRecreditAmountToShowMutation'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { defaultCreditByAge } from 'shared/credits/defaultCreditByAge'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import BirthdayCake from 'ui/animations/onboarding_birthday_cake.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { categoriesIcons } from 'ui/svg/icons/exports/categoriesIcons'
import { Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export function BeneficiaryAccountCreated() {
  const { designSystem } = useTheme()
  const { user, refetchUser } = useAuthContext()

  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const { showShareAppModal } = useShareAppContext()

  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
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
    showShareAppModal(ShareAppModalType.BENEFICIARY)
    resetRecreditAmountToShow()
  }, [resetRecreditAmountToShow, showShareAppModal])

  const { requestReview } = useReviewInApp()

  // Credit has just been granted: prompt for a store review if it arrived in less
  // than 24h after the profile journey started. Firing here (rather than on the Home)
  // avoids overlapping with the share-app modal opened right before navigation.
  useEffect(() => {
    const run = async () => {
      if (await isFastCreditCandidate()) {
        void requestReview('credit_received', { delayMs: CREDIT_REVIEW_DELAY_MS })
      }
    }
    void run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEnterKeyAction(navigateToHome)

  return (
    <GenericInfoPage
      animation={BirthdayCake}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      title="Bonne nouvelle&nbsp;!"
      subtitle={subtitle}
      buttonPrimary={{
        wording: 'C’est parti\u00a0!',
        onBeforeNavigate: onBeforeNavigate,
        navigateTo: navigateToHomeConfig,
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

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.l,
}))

const ProgressBarContainer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xxxl,
}))

const Amount = styled(Typo.Title2).attrs(getNoHeadingAttrs())(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.brandPrimary,
}))
