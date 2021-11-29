import { t } from '@lingui/macro'
import LottieView from 'lottie-react-native'
import React, { useEffect } from 'react'

import {
  Amount,
  ProgressBarContainer,
  StyledSubtitle,
  Text,
  ButtonContainer,
} from 'features/auth/signup/underageSignup/notificationPagesStyles'
import { useUserProfileInfo } from 'features/home/api'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { formatToFrenchDecimal } from 'libs/parsers'
import { storage } from 'libs/storage'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import { Spacer } from 'ui/components/spacer/Spacer'
import CategoryIcon from 'ui/svg/icons/categories/bicolor_deprecated'
import { ColorsEnum } from 'ui/theme'

export const RecreditBirthdayNotification = () => {
  const { data: user } = useUserProfileInfo()
  const age = user?.dateOfBirth
    ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
    : undefined
  const animationRef = React.useRef<LottieView>(null)
  const credit = useAvailableCredit()
  // TODO(PC-11883): get the real amount from user.recreditAmountToShow
  const creditedAmount = 30
  const remainingCredit = formatToFrenchDecimal(credit?.amount ?? 3000)

  useEffect(() => {
    storage.saveObject('has_seen_birthday_notification_card', true)
    analytics.logScreenView('BirthdayNotification')
  }, [])

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play(0, 62)
    }
  }, [animationRef])

  return (
    <GenericInfoPageWhite animation={TutorialPassLogo} title={t`Bonne nouvelle !`}>
      <StyledSubtitle>
        {t({
          id: 'birthday notification text',
          values: { creditedAmount, age },
          message: `Pour tes {age} ans, le Gouvernement vient d'ajouter {creditedAmount} euros à ton crédit. Tu disposes maintenant de :`,
        })}
      </StyledSubtitle>

      <Spacer.Column numberOfSpaces={4} />
      <ProgressBarContainer>
        <ProgressBar
          progress={1}
          color={ColorsEnum.BRAND}
          icon={CategoryIcon.Spectacles}
          isAnimated
        />
        <Amount color={ColorsEnum.BRAND}>{remainingCredit}</Amount>
      </ProgressBarContainer>
      <Spacer.Column numberOfSpaces={4} />
      <Text>{t`Tu as jusqu’à la veille de tes 18 ans pour profiter de ton budget.`}</Text>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonContainer>
        <ButtonPrimary title={t`Continuer`} onPress={navigateToHome} />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}
