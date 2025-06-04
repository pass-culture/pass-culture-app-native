import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { storage } from 'libs/storage'
import { useAnimationToDisplay } from 'libs/styled/useAnimationToDisplay'
import { useResetRecreditAmountToShowMutation } from 'queries/profile/useResetRecreditAmountToShowMutation'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { getAge } from 'shared/user/getAge'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { getSpacing, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const RecreditBirthdayNotification = () => {
  // TODO(PC-36293): use TutorialPassLogoDark and TutorialPassLogoLight
  const animation = useAnimationToDisplay({
    light: TutorialPassLogo,
    dark: TutorialPassLogo,
  })

  const { user } = useAuthContext()
  const { designSystem } = useTheme()

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
    useResetRecreditAmountToShowMutation({
      onSuccess: () => navigateToHome(),
      onError: () => showErrorSnackBar({ message: 'Une erreur est survenue' }),
    })

  useEffect(() => {
    storage.saveObject('has_seen_birthday_notification_card', true)
  }, [])

  const recreditMessage = age
    ? `Pour tes ${age} ans, ${creditedAmount} ont été ajoutés à ton compte. Tu disposes maintenant de\u00a0:`
    : undefined

  return (
    <GenericInfoPage
      animation={animation}
      title="Bonne nouvelle&nbsp;!"
      subtitle={recreditMessage}
      buttonPrimary={{
        wording: 'Continuer',
        onPress: resetRecreditAmountToShow,
        isLoading: isResetRecreditAmountToShowLoading,
      }}>
      <React.Fragment>
        <ProgressBarContainer>
          <AnimatedProgressBar
            progress={1}
            color={designSystem.color.text.brandPrimary}
            icon={categoriesIcons.Show}
            isAnimated
          />
          <Amount>{remainingCredit}</Amount>
        </ProgressBarContainer>
        <StyledBody>
          Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.
        </StyledBody>
      </React.Fragment>
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
