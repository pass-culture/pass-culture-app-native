import React from 'react'

import { SummaryInfoItem } from 'features/offer/helpers/useOfferSummaryInfoList/useOfferSummaryInfoList'
import { OfferSummaryInfoList } from 'features/offerv2/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { render, screen } from 'tests/utils'
import { CalendarS } from 'ui/svg/icons/CalendarS'

describe('<OfferSummaryInfoList />', () => {
  it('should display offer dates when there is a date in summary info items', () => {
    const summaryInfoItems: SummaryInfoItem[] = [
      {
        isDisplayed: true,
        Icon: <CalendarS />,
        title: 'Dates',
        subtitle: 'Les 3 et 4 janvier 2021',
      },
    ]
    render(<OfferSummaryInfoList summaryInfoItems={summaryInfoItems} />)

    expect(screen.getByText('Les 3 et 4 janvier 2021')).toBeOnTheScreen()
  })

  it('should not display offer dates when there is not a date in summary info items', () => {
    const summaryInfoItems: SummaryInfoItem[] = []
    render(<OfferSummaryInfoList summaryInfoItems={summaryInfoItems} />)

    expect(screen.queryByText('Les 3 et 4 janvier 2021')).not.toBeOnTheScreen()
  })
})
