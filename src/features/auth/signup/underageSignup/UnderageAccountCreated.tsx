import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import Governement from 'ui/animations/government.json'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import CategoryIcon from 'ui/svg/icons/categories/bicolor'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function UnderageAccountCreated() {
  const maxPrice = useMaxPrice()
  const text = t`Tu as jusqu’à la veille de tes 18 ans pour profiter de ton budget. Découvre dès maintenant les offres culturelles autour de chez toi !`

  return (
    <GenericInfoPageWhite animation={Governement} title={t`Bonne nouvelle !`}>
      <StyledSubtitle>
        {maxPrice + '\u00a0' + t`€ viennent d'être crédités sur ton compte pass Culture`}
      </StyledSubtitle>

      <Spacer.Column numberOfSpaces={4} />
      <ProgressBarContainer>
        <ProgressBar
          progress={1}
          color={ColorsEnum.BRAND}
          icon={CategoryIcon.Spectacles}
          isAnimated
        />
        <Amount color={ColorsEnum.BRAND}>{maxPrice + '€'}</Amount>
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

const ProgressBarContainer = styled.View({
  paddingHorizontal: getSpacing(10),
})

const Amount = styled(Typo.Title2)({
  textAlign: 'center',
})

const Text = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledSubtitle = styled(Typo.Title4)({
  textAlign: 'center',
})

const ButtonContainer = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
})
