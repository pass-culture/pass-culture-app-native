import React, { useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { creditActions } from 'features/identityCheck/api/useCreditStore'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useResetRecreditAmountToShow } from 'features/profile/api/useResetRecreditAmountToShow'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { defaultCreditByAge } from 'shared/credits/defaultCreditByAge'
import { useShouldShowCulturalSurveyForBeneficiaryUser } from 'shared/culturalSurvey/useShouldShowCulturalSurveyForBeneficiaryUser'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export function BeneficiaryAccountCreated() {
  const maxPriceInCents = useMaxPrice()
  const { uniqueColors } = useTheme()
  const { user, refetchUser } = useAuthContext()

  const { data: settings } = useSettingsContext()

  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const shouldShowCulturalSurvey = useShouldShowCulturalSurveyForBeneficiaryUser()
  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)
  const { showShareAppModal } = useShareAppContext()

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const maxPrice = formatCurrencyFromCents(maxPriceInCents, currency, euroToPacificFrancRate)
  const fallbackAmount = isUnderageBeneficiary
    ? defaultCreditByAge.v3.age_17
    : defaultCreditByAge.v3.age_18
  const recreditAmount = formatCurrencyFromCents(
    user?.recreditAmountToShow || fallbackAmount,
    currency,
    euroToPacificFrancRate
  )
  const subtitle = `${maxPrice} viennent d’être crédités sur ton compte pass Culture`
  const subtitleV3 = `${recreditAmount} viennent d’être crédités sur ton compte pass Culture`

  const enableCreditV3 = settings?.wipEnableCreditV3

  const { mutate: resetRecreditAmountToShow } = useResetRecreditAmountToShow({
    onSuccess: () => {
      refetchUser()
    },
  })

  const unnderageBeneficiaryText = isUnderageBeneficiary
    ? 'Tu as jusqu’à la veille de tes 18 ans pour profiter de ton crédit.'
    : 'Tu as deux ans pour profiter de ton crédit.'

  const text = enableCreditV3
    ? 'Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.'
    : unnderageBeneficiaryText

  const onBeforeNavigate = useCallback(() => {
    BatchProfile.trackEvent(BatchEvent.hasValidatedSubscription)
    if (!user?.needsToFillCulturalSurvey) showShareAppModal(ShareAppModalType.BENEFICIARY)
    creditActions.setActivationDate(new Date())
    resetRecreditAmountToShow()
  }, [resetRecreditAmountToShow, showShareAppModal, user?.needsToFillCulturalSurvey])

  useEnterKeyAction(navigateToHome)

  return (
    <GenericInfoPageWhite
      animation={TutorialPassLogo}
      title="Bonne nouvelle&nbsp;!"
      subtitle={enableCreditV3 ? subtitleV3 : subtitle}
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
          color={uniqueColors.brand}
          icon={categoriesIcons.Show}
          isAnimated
        />
        <Amount>{enableCreditV3 ? recreditAmount : maxPrice}</Amount>
      </ProgressBarContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{text}</StyledBody>
    </GenericInfoPageWhite>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ProgressBarContainer = styled.View({
  paddingHorizontal: getSpacing(10),
})

const Amount = styled(Typo.Title2).attrs(getNoHeadingAttrs())(({ theme }) => ({
  textAlign: 'center',
  color: theme.uniqueColors.brand,
}))
