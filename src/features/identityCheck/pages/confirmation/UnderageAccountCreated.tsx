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
import { navigateToHome } from 'features/navigation/helpers'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { formatPriceInEuroToDisplayPrice } from 'libs/parsers'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import CategoryIcon from 'ui/svg/icons/categories/bicolor'
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
        <ProgressBar
          progress={1}
          color={uniqueColors.brand}
          icon={CategoryIcon.Spectacles}
          isAnimated
        />
        <Amount color={uniqueColors.brand}>{formatPriceInEuroToDisplayPrice(maxPrice)}</Amount>
      </ProgressBarContainer>
      <Spacer.Column numberOfSpaces={4} />
      <Text>{text}</Text>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonContainer>
        <ButtonPrimary wording={t`Je découvre les offres`} onPress={navigateToHome} />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}
