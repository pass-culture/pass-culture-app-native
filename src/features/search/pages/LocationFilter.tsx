import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'

export const LocationFilter: React.FC = () => (
  <React.Fragment>
    <PageHeader title={_(t`Localisation`)} />
  </React.Fragment>
)
