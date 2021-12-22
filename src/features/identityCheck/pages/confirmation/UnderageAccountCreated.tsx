import { t } from '@lingui/macro'
import React from 'react'

import {
  Amount,
  ProgressBarContainer,
  StyledSubtitle,
  Text,
  ButtonContainer,
} from 'features/auth/signup/underageSignup/notificationPagesStyles'
import { navigateToHome } from 'features/navigation/helpers'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import CategoryIcon from 'ui/svg/icons/categories/bicolor'
import { UniqueColors, Spacer } from 'ui/theme'

export function UnderageAccountCreated() {
  const maxPrice = useMaxPrice()
  const text = t`Tu as jusqu’à la veille de tes 18 ans pour profiter de ton budget. Découvre dès maintenant les offres culturelles autour de chez toi\u00a0!`

  return (
    <GenericInfoPageWhite animation={TutorialPassLogo} title={t`Bonne nouvelle\u00a0!`}>
      <StyledSubtitle>
        {maxPrice + '\u00a0' + t`€ viennent d'être crédités sur ton compte pass Culture`}
      </StyledSubtitle>

      <Spacer.Column numberOfSpaces={4} />
      <ProgressBarContainer>
        <ProgressBar
          progress={1}
          color={UniqueColors.BRAND}
          icon={CategoryIcon.Spectacles}
          iconSize={20}
          isAnimated
        />
        <Amount color={UniqueColors.BRAND}>{maxPrice + '€'}</Amount>
      </ProgressBarContainer>
      <Spacer.Column numberOfSpaces={4} />
      <Text>{text}</Text>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonContainer>
        <ButtonPrimary title={t`Je découvre les offres`} onPress={navigateToHome} />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}
