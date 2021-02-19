import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Typo } from 'ui/theme'

export const BookingInformations: React.FC = () => {
  return <Typo.Title4>{_(t`Booking informations`)}</Typo.Title4>
}
