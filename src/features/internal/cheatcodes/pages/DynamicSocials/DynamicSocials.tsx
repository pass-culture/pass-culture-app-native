import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { InstalledMessagingApps } from 'features/offer/components/shareMessagingOffer/InstalledMessagingApps'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { getSpacing } from 'ui/theme'

interface Props {
  children?: never
}

export const DynamicSocials: FunctionComponent<Props> = () => {
  return (
    <React.Fragment>
      <PageHeaderSecondary title="Spike réseaux sociaux dynamiques" />
      <Container>
        <InstalledMessagingApps />
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
