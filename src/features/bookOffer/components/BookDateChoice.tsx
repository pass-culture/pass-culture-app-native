import { t } from '@lingui/macro'
import React from 'react'

import { OfferStockResponse } from 'api/gen'
import { _ } from 'libs/i18n'
import { Spacer, Typo } from 'ui/theme'

import { Calendar } from './Calendar/Calendar'

interface Props {
  stocks: OfferStockResponse[]
  userRemainingCredit: number | null
}
export const BookDateChoice: React.FC<Props> = ({ stocks, userRemainingCredit }) => {
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Title4>{_(t`Date`)}</Typo.Title4>
      <Calendar stocks={stocks} userRemainingCredit={userRemainingCredit} />
    </React.Fragment>
  )
}
