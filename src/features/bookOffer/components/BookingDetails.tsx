import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, Spacer } from 'ui/theme'

import { BookingInformations } from './BookingInformations'
import { CancellationDetails } from './CancellationDetails'

const disclaimer = _(
  t`Les biens acquis ou réservés sur le pass Culture sont destinés à un usage strictement personnel et ne peuvent faire l’objet de revente.`
)

export const BookingDetails: React.FC = () => {
  return (
    <Container>
      <Banner title={disclaimer} />
      <Spacer.Column numberOfSpaces={6} />

      <BookingInformations />

      <Spacer.Column numberOfSpaces={6} />
      <Separator />
      <Spacer.Column numberOfSpaces={6} />

      <CancellationDetails />

      <Spacer.Column numberOfSpaces={6} />

      <ButtonPrimary title={_(t`Confirmer la réservation`)} />
    </Container>
  )
}

const Container = styled.View({ width: '100%' })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
})
