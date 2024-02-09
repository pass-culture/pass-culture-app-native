import React, { FunctionComponent } from 'react'

import { SummaryInfoItem } from 'features/offer/helpers/useOfferSummaryInfoList/useOfferSummaryInfoList'
import { SummaryInfo } from 'ui/components/SummaryInfo'

type Props = {
  summaryInfoItems: SummaryInfoItem[]
}

export const OfferSummaryInfoList: FunctionComponent<Props> = ({ summaryInfoItems }) => (
  <React.Fragment>
    {summaryInfoItems.map(({ Icon, title, subtitle }) => (
      <SummaryInfo key={title} Icon={Icon} title={title} subtitle={subtitle} />
    ))}
  </React.Fragment>
)
