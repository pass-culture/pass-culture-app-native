import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Banner, BannerType } from 'ui/components/Banner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer } from 'ui/theme'

import { LocationChoice } from '../components/LocationChoice'
import { LocationChoiceType } from '../locationChoice.types'

export const LocationFilter: React.FC = () => (
  <React.Fragment>
    <Spacer.TopScreen />
    <Spacer.Column numberOfSpaces={14} />
    <Spacer.Column numberOfSpaces={6} />
    <Banner
      title={_(
        t`Seules les offres Sorties et Physiques seront affichées pour une recherche avec une localisation`
      )}
      type={BannerType.INFO}
    />
    <Spacer.Column numberOfSpaces={6} />
    <LocationChoice type={LocationChoiceType.AROUND_ME} />
    <Spacer.Column numberOfSpaces={4} />
    <LocationChoice type={LocationChoiceType.EVERYWHERE} />
    <PageHeader title={_(t`Localisation`)} />
  </React.Fragment>
)
