import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function IdentityCheckUnavailable() {
  return (
    <GenericInfoPage
      title={t`Victime de notre succès !`}
      icon={({ color }) => <HappyFace size={getSpacing(30)} color={color} />}>
      <StyledBody>{t`Vous êtes actuellement très nombreux à vouloir créer un compte, notre service rencontre quelques difficultés.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>{t`Nous reviendrons vers toi dès que le service sera rétabli.`}</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonTertiaryWhite
        title={t`Retourner à l'accueil`}
        onPress={navigateToHome}
        icon={PlainArrowPrevious}
      />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
