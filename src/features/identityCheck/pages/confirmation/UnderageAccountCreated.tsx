import { t } from '@lingui/macro'
import React from 'react'
import { useTheme } from 'styled-components/native'

import {
  Amount,
  ProgressBarContainer,
  StyledSubtitle,
  Text,
  ButtonContainer,
} from 'features/auth/signup/underageSignup/notificationPagesStyles'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
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

export function UnderageAccountCreated() {
  const maxPrice = useMaxPrice()
  const { uniqueColors } = useTheme()

  const text = t`Tu as jusqu’à la veille de tes 18 ans pour profiter de ton budget. Découvre dès maintenant les offres culturelles autour de chez toi\u00a0!`

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
      <Text>{text}</Text>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonContainer>
        <TouchableLink
          as={ButtonPrimary}
          wording={t`Je découvre les offres`}
          navigateTo={navigateToHomeConfig}
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}
