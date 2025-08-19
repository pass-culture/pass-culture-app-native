import React from 'react'

import { PageHeader } from 'ui/components/headers/PageHeader'
import { Page } from 'ui/pages/Page'

import { NearMeContainer } from '../../containers/NearMeContainer/NearMeContainer'

export const NearMePage = () => (
  <Page>
    <PageHeader title="Autour de moi" />
    <NearMeContainer />
  </Page>
)
