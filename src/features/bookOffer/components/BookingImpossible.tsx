import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { SadFace } from 'ui/svg/icons/SadFace'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  dismissModal: () => void
}

export const BookingImpossible: React.FC<Props> = ({ dismissModal }) => (
  <Container>
    <SadFace size={getSpacing(17)} color={ColorsEnum.GREY_DARK} />
    <Spacer.Column numberOfSpaces={6} />

    <Content>
      {_(
        t`Les conditions générales d'utilisation de l'App Store iOS ne permettent pas de réserver cette offre sur l'application.`
      )}
    </Content>
    <Spacer.Column numberOfSpaces={6} />
    <Content>
      {_(
        t`Ajoute cette offre à tes favoris et rends-toi vite sur le site pass Culture afin de la réserver.`
      )}
    </Content>

    <Spacer.Column numberOfSpaces={6} />

    <ButtonPrimary title={_(t`Mettre en favoris`)} />
    <Spacer.Column numberOfSpaces={4} />
    <ButtonTertiary title={_(t`Retourner à l'offre`)} onPress={dismissModal} />
    <Spacer.Column numberOfSpaces={4} />
  </Container>
)

const Container = styled.View({
  width: '100%',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
})
const Content = styled(Typo.Body)({ textAlign: 'center', paddingHorizontal: getSpacing(6) })
