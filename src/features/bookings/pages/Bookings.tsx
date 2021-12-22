import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { OnGoingBookingsList } from 'features/bookings/components/OnGoingBookingsList'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'

export function Bookings() {
  return (
    <Container>
      <SvgPageHeader title={t`Mes réservations`} />
      <OnGoingBookingsList />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
