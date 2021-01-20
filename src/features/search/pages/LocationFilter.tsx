import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Banner, BannerType } from 'ui/components/Banner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { AroundMe } from 'ui/svg/icons/AroundMe'
import { Everywhere } from 'ui/svg/icons/Everywhere'
import { Spacer } from 'ui/theme'

import { LocationChoice } from '../components/LocationChoice'

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
    <LocationChoice text={_(t`Autour de moi`)} icon={<AroundMe size={48} />} />
    <Spacer.Column numberOfSpaces={4} />
    <LocationChoice text={_(t`Partout`)} icon={<Everywhere size={48} />} />
    <PageHeader title={_(t`Localisation`)} />
  </React.Fragment>
)
