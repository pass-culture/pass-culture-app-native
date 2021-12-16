import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { AccountLocked } from 'ui/svg/icons/AccountLocked'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export function PhoneValidationTooManySMSSent() {
  return (
    <GenericInfoPage title={t`Trop de tentatives\u00a0!`} icon={AccountLocked}>
      <StyledBody>
        {t`Tu as dépassé le nombre d’essais autorisés. Tu pourras réessayer dans 12 heures\u00a0!`}
      </StyledBody>

      <Spacer.Column numberOfSpaces={22} />
      <ButtonPrimaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
