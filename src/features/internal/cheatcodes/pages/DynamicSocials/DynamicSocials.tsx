import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useSomeOfferId } from 'features/internal/cheatcodes/hooks/useSomeOfferId'
import { InstalledMessagingApps } from 'features/offer/components/shareMessagingOffer/InstalledMessagingApps'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { getSpacing } from 'ui/theme'

interface Props {
  children?: never
}

export const DynamicSocials: FunctionComponent<Props> = () => {
  const offerId = useSomeOfferId()
  return (
    <React.Fragment>
      <PageHeaderSecondary title="Spike réseaux sociaux dynamiques" />
      <Container>
        <InstalledMessagingApps offerId={offerId} />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({
  padding: getSpacing(2),
  paddingTop: getSpacing(6),
  justifyContent: 'space-between',
  flexDirection: 'row',
  flex: 1,
})
