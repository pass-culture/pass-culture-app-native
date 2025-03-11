import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { useResetRecreditAmountToShow } from 'features/profile/api/useResetRecreditAmountToShow'
import { storage } from 'libs/storage'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { getAge } from 'shared/user/getAge'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spacer } from 'ui/components/spacer/Spacer'
import { GenericInfoPageWhiteLegacy } from 'ui/pages/GenericInfoPageWhiteLegacy'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { getSpacing, TypoDS } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const RecreditBirthdayNotification = () => {
  const { user } = useAuthContext()
  const { uniqueColors } = useTheme()
  const { data: settings } = useSettingsContext()

  const age = getAge(user?.birthDate)

  const credit = useAvailableCredit()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const creditedAmount = formatCurrencyFromCents(
    user?.recreditAmountToShow ?? 3000,
    currency,
    euroToPacificFrancRate
  )
  const remainingCredit = formatCurrencyFromCents(
    credit?.amount ?? 3000,
    currency,
    euroToPacificFrancRate
  )
  const { showErrorSnackBar } = useSnackBarContext()

  const { mutate: resetRecreditAmountToShow, isLoading: isResetRecreditAmountToShowLoading } =
    useResetRecreditAmountToShow({
      onSuccess: () => {
        navigateToHome()
      },
      onError: () => {
        showErrorSnackBar({
          message: 'Une erreur est survenue',
        })
      },
    })

  const onPressContinue = () => {
    resetRecreditAmountToShow()
  }

  useEffect(() => {
    storage.saveObject('has_seen_birthday_notification_card', true)
  }, [])

  const recreditMessage = age
    ? `Pour tes ${age} ans, ${creditedAmount} ont été ajoutés à ton compte. Tu disposes maintenant de\u00a0:`
    : ''

  const enableCreditV3 = settings?.wipEnableCreditV3
  const text = enableCreditV3
    ? 'Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.'
    : 'Tu as jusqu’à la veille de tes 18 ans pour profiter de ton crédit.'

  return (
    <GenericInfoPageWhiteLegacy animation={TutorialPassLogo} title="Bonne nouvelle&nbsp;!">
      <StyledSubtitle testID="recreditMessage">{recreditMessage}</StyledSubtitle>

      <Spacer.Column numberOfSpaces={4} />
      <ProgressBarContainer>
        <AnimatedProgressBar
          progress={1}
          color={uniqueColors.brand}
          icon={categoriesIcons.Show}
          isAnimated
        />
        <Amount>{remainingCredit}</Amount>
      </ProgressBarContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{text}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonContainer>
        <ButtonPrimary
          wording="Continuer"
          onPress={onPressContinue}
          isLoading={isResetRecreditAmountToShowLoading}
        />
      </ButtonContainer>
    </GenericInfoPageWhiteLegacy>
  )
}

const StyledSubtitle = styled(TypoDS.Title4).attrs(getNoHeadingAttrs())({
  textAlign: 'center',
})

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})

const ProgressBarContainer = styled.View({
  paddingHorizontal: getSpacing(10),
})

const Amount = styled(TypoDS.Title2).attrs(getNoHeadingAttrs())(({ theme }) => ({
  textAlign: 'center',
  color: theme.uniqueColors.brand,
}))

const ButtonContainer = styled.View({
  alignItems: 'center',
})
