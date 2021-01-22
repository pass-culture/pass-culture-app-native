import { t } from '@lingui/macro'
import React from 'react'

import { Section } from 'features/search/atoms'
import { DateFilter } from 'features/search/atoms/Buttons'
import { CalendarPicker } from 'features/search/components'
import { _ } from 'libs/i18n'

export const OfferDate: React.FC = () => {
  return (
    <React.Fragment>
      <Section title={_(t`Date de l'offre`)} count={0}>
        <DateFilter text={_(t`Aujourd'hui`)} />
        <DateFilter text={_(t`Cette semaine`)} />
        <DateFilter text={_(t`Ce week-end`)} />
      </Section>
      <CalendarPicker />
    </React.Fragment>
  )
}
