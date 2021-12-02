import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { DigitalIcon } from 'ui/svg/icons/venueTypes'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export const DMSInformation = () => (
  <Container>
    <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Tu n'as pas de smartphone ?`}</Typo.Body>
    <Spacer.Column numberOfSpaces={4} />
    <ButtonTertiaryBlack
      title={t`Identification par le site Démarches-Simplifiées`}
      onPress={() => openUrl(env.DSM_URL)}
      icon={DigitalIcon}
    />
    <Typo.Caption color={ColorsEnum.GREY_DARK}>{t`Environ 10 jours`}</Typo.Caption>
  </Container>
)

const Container = styled.View({
  alignItems: 'center',
  display: 'flex',
})
