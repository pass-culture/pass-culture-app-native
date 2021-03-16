import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { Spacer, Typo } from 'ui/theme'

import { useBookings } from '../api'

export const Bookings: React.FC = () => {
  const { data } = useBookings()

  return (
    <React.Fragment>
      <SvgPageHeader title="Mes réservations" />
      <Container>
        <Spacer.Flex />
        <Typo.Hero>{_(t`Bookings`)}</Typo.Hero>
        <Spacer.Flex />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({ flex: 1, alignItems: 'center' })
