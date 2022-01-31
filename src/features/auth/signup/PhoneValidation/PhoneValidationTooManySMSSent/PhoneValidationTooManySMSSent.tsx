import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Typo } from 'ui/theme'

export function PhoneValidationTooManySMSSent() {
  return (
    <GenericInfoPage
      title={t`Trop de tentatives\u00a0!`}
      icon={UserBlocked}
      buttons={[
        <ButtonPrimaryWhite key={1} wording={t`Retourner à l'accueil`} onPress={navigateToHome} />,
      ]}>
      <StyledBody>
        {t`Tu as dépassé le nombre d’essais autorisés. Tu pourras réessayer dans 12 heures\u00a0!`}
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
