import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Banner } from 'ui/components/Banner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer } from 'ui/theme'

export const LocationFilter: React.FC = () => (
  <React.Fragment>
    <Spacer.TopScreen />
    <Spacer.Column numberOfSpaces={14} />
    <Banner />
    <PageHeader title={_(t`Localisation`)} />
  </React.Fragment>
)
