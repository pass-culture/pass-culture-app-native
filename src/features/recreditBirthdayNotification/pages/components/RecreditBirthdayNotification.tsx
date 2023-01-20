import React, { useCallback, useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers'
import { useResetRecreditAmountToShow } from 'features/profile/api/useResetRecreditAmountToShow'
import { useAppStateChange } from 'libs/appState'
import { analytics } from 'libs/firebase/analytics'
import LottieView from 'libs/lottie'
import { formatToFrenchDecimal } from 'libs/parsers'
import { storage } from 'libs/storage'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spacer } from 'ui/components/spacer/Spacer'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { getSpacing, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const RecreditBirthdayNotification = () => {
  const { user } = useAuthContext()
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
          message: 'Une erreur est survenue',
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

  const recreditMessage = `Pour tes ${age} ans, l’État vient d'ajouter ${creditedAmount} à ton crédit. Tu disposes maintenant de\u00a0:`

  return (
    <GenericInfoPageWhite animation={TutorialPassLogo} title={'Bonne nouvelle\u00a0!'}>
      <StyledSubtitle testID={'recreditMessage'}>{recreditMessage}</StyledSubtitle>

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
      <StyledBody>Tu as jusqu’à la veille de tes 18 ans pour profiter de ton budget</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonContainer>
        <ButtonPrimary
          wording="Continuer"
          onPress={onPressContinue}
          isLoading={isResetRecreditAmountToShowLoading}
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}

const StyledSubtitle = styled(Typo.Title4).attrs(getNoHeadingAttrs())({
  textAlign: 'center',
})

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

const ButtonContainer = styled.View({
  alignItems: 'center',
})
