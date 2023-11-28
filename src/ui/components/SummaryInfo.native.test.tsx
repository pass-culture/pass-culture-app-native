import React from 'react'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { SummaryInfo } from 'ui/components/SummaryInfo'
import { CalendarS } from 'ui/svg/icons/CalendarS'

describe('<SummaryInfo />', () => {
  it('should display icon', () => {
    render(
      <SummaryInfo Icon={<CalendarS size={theme.icons.sizes.small} testID="icon" />} title="Date" />
    )

    expect(screen.getByTestId('icon')).toBeOnTheScreen()
  })

  it('should display title', () => {
    render(<SummaryInfo Icon={<CalendarS size={theme.icons.sizes.small} />} title="Date" />)

    expect(screen.getByText('Date')).toBeOnTheScreen()
  })

  it('should display subtitle when it defined', () => {
    render(
      <SummaryInfo
        Icon={<CalendarS size={theme.icons.sizes.small} />}
        title="Date"
        subtitle="Du 18 octobre 2023 au 27 janvier 2024"
      />
    )

    expect(screen.getByText('Du 18 octobre 2023 au 27 janvier 2024')).toBeOnTheScreen()
  })

  it('should display bottom separator', () => {
    render(<SummaryInfo Icon={<CalendarS size={theme.icons.sizes.small} />} title="Date" />)

    expect(screen.getByTestId('bottomSeparator')).toBeOnTheScreen()
  })
})
