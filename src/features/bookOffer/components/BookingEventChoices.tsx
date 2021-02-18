import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Typo } from 'ui/theme'

export const BookingEventChoices: React.FC = () => {
  return <Typo.Hero>{_(t`Je suis une offre Evenement `)}</Typo.Hero>
}
