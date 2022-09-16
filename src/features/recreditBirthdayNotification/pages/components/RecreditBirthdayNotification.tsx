import { t } from '@lingui/macro'
import React, { useCallback, useEffect } from 'react'
import { useTheme } from 'styled-components/native'

import {
  Amount,
  ProgressBarContainer,
  StyledSubtitle,
  StyledBody,
  ButtonContainer,
} from 'features/auth/signup/underageSignup/notificationPagesStyles'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { navigateToHome } from 'features/navigation/helpers'
import { useUserProfileInfo, useResetRecreditAmountToShow } from 'features/profile/api'
import { useAppStateChange } from 'libs/appState'
import { analytics } from 'libs/firebase/analytics'
import LottieView from 'libs/lottie'
import { formatToFrenchDecimal } from 'libs/parsers'
import { storage } from 'libs/storage'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spacer } from 'ui/components/spacer/Spacer'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'

export const RecreditBirthdayNotification = () => {
  const { data: user } = useUserProfileInfo()
  const { uniqueColors } = useTheme()
  const age = user?.dateOfBirth
    ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
    : undefined
  const animationRef = React.useRef<LottieView>(null)
  const credit = useAvailableCredit()
  const creditedAmount = formatToFrenchDecimal(user?.recreditAmountToShow ?? 3000)
  const remainingCredit = formatToFrenchDecimal(credit?.amount ?? 3000)
  const { showErrorSnackBar } = useSnackBarContext()

  const { mutate: resetRecreditAmountToShow, isLoading: isResetRecreditAmountToShowLoading } =
    useResetRecreditAmountToShow({
      onSuccess: () => {
        navigateToHome()
      },
      onError: () => {
        showErrorSnackBar({
          message: t`Une erreur est survenue`,
        })
      },
    })

  const onPressContinue = () => {
    resetRecreditAmountToShow()
  }

  useEffect(() => {
    storage.saveObject('has_seen_birthday_notification_card', true)
    analytics.logScreenView('BirthdayNotification')
  }, [])

  const playAnimation = useCallback(() => {
    const lottieAnimation = animationRef.current
    if (lottieAnimation) lottieAnimation.play(0, 62)
  }, [animationRef])

  useAppStateChange(playAnimation, undefined)
  useEffect(playAnimation, [playAnimation])

  return (
    <GenericInfoPageWhite animation={TutorialPassLogo} title={t`Bonne nouvelle\u00a0!`}>
      <StyledSubtitle testID={'recreditMessage'}>
        {t({
          id: 'birthday notification text',
          values: { creditedAmount, age },
          message: `Pour tes {age} ans, le Gouvernement vient d'ajouter {creditedAmount} à ton crédit. Tu disposes maintenant de\u00a0:`,
        })}
      </StyledSubtitle>

      <Spacer.Column numberOfSpaces={4} />
      <ProgressBarContainer>
        <AnimatedProgressBar
          progress={1}
          color={uniqueColors.brand}
          icon={categoriesIcons.Show}
          isAnimated
        />
        <Amount color={uniqueColors.brand}>{remainingCredit}</Amount>
      </ProgressBarContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{t`Tu as jusqu’à la veille de tes 18 ans pour profiter de ton budget.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonContainer>
        <ButtonPrimary
          wording={t`Continuer`}
          onPress={onPressContinue}
          isLoading={isResetRecreditAmountToShowLoading}
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}
