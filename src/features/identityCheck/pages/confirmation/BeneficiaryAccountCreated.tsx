import { t } from '@lingui/macro'
import React from 'react'
import { useTheme } from 'styled-components/native'

import {
  Amount,
  ProgressBarContainer,
  StyledSubtitle,
  StyledBody,
  ButtonContainer,
} from 'features/auth/signup/underageSignup/notificationPagesStyles'
import {
  shouldShowCulturalSurvey,
  useCulturalSurveyRoute,
} from 'features/culturalSurvey/helpers/utils'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { useUserProfileInfo } from 'features/profile/api'
import { isUserUnderageBeneficiary } from 'features/profile/utils'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { formatPriceInEuroToDisplayPrice } from 'libs/parsers'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { Spacer } from 'ui/theme'

export function BeneficiaryAccountCreated() {
  const maxPrice = useMaxPrice()
  const { uniqueColors } = useTheme()
  const { data: user } = useUserProfileInfo()
  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const culturalSurveyRoute = useCulturalSurveyRoute()
  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  const text = isUnderageBeneficiary
    ? t`Tu as jusqu’à la veille de tes 18 ans pour profiter de ton budget. Découvre dès maintenant les offres culturelles autour de chez toi\u00a0!`
    : t`Tu as deux ans pour profiter de ton budget. Découvre dès maintenant les offres culturelles autour de chez toi\u00a0!`

  useEnterKeyAction(navigateToHome)

  return (
    <GenericInfoPageWhite animation={TutorialPassLogo} title={t`Bonne nouvelle\u00a0!`}>
      <StyledSubtitle>
        {t`${maxPrice}\u00a0€ viennent d'être crédités sur ton compte pass Culture`}
      </StyledSubtitle>

      <Spacer.Column numberOfSpaces={4} />
      <ProgressBarContainer>
        <AnimatedProgressBar
          progress={1}
          color={uniqueColors.brand}
          icon={categoriesIcons.Show}
          isAnimated
        />
        <Amount color={uniqueColors.brand}>{formatPriceInEuroToDisplayPrice(maxPrice)}</Amount>
      </ProgressBarContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{text}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonContainer>
        <TouchableLink
          as={ButtonPrimary}
          wording={t`Je découvre les offres`}
          navigateTo={
            shouldNavigateToCulturalSurvey ? { screen: culturalSurveyRoute } : navigateToHomeConfig
          }
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}
