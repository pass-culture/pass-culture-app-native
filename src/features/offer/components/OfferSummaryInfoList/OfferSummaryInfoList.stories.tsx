import type { Meta } from '@storybook/react'
import React from 'react'

import { OfferSummaryInfoList } from 'features/offer/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { CalendarS } from 'ui/svg/icons/CalendarS'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Digital } from 'ui/svg/icons/Digital'
import { Stock } from 'ui/svg/icons/Stock'

const meta: Meta<typeof OfferSummaryInfoList> = {
  title: 'features/offer/OfferSummaryInfoList',
  component: OfferSummaryInfoList,
}
export default meta

const Template = (props: React.ComponentProps<typeof OfferSummaryInfoList>) => (
  <OfferSummaryInfoList {...props} />
)

export const Default = {
  name: 'OfferSummaryInfoList',
  render: () =>
    Template({
      summaryInfoItems: [
        { isDisplayed: true, Icon: <CalendarS />, title: 'Dates', subtitle: 'les 3 et 4 Avril ' },
        { isDisplayed: true, Icon: <Digital />, title: 'En ligne', subtitle: 'PATHE BEAUGRENELLE' },
        { isDisplayed: true, Icon: <ClockFilled />, title: 'Durée', subtitle: '1h30' },
        {
          isDisplayed: true,
          Icon: <Stock />,
          title: 'Duo',
          subtitle: 'Tu peux prendre deux places',
        },
      ],
    }),
}
