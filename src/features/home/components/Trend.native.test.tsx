import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { Trend } from 'features/home/components/Trend'
import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'
import { TrendBlock } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

describe('Trend', () => {
  it('should redirect to VenueMap when content type is venue map block', async () => {
    const venueMapBlock = formattedTrendsModule.items[0] as TrendBlock
    render(<Trend moduleId="module-id" {...venueMapBlock} />)

    fireEvent.press(screen.getByText('Accès carte des lieux'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('VenueMap', undefined)
    })
  })

  it('should redirect to thematic home when content type is trend block', () => {
    const trendBlock = formattedTrendsModule.items[1] as TrendBlock
    render(<Trend moduleId="module-id" {...trendBlock} />)

    fireEvent.press(screen.getByText('Tendance 1'))

    expect(navigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: '7qcfqY5zFesLVO5fMb4cqm',
      moduleId: 'module-id',
      from: 'trend_block',
    })
  })

  it('should log analytics when navigating to VenueMap', () => {
    const venueMapBlock = formattedTrendsModule.items[0] as TrendBlock
    render(<Trend moduleId="module-id" {...venueMapBlock} />)

    fireEvent.press(screen.getByText('Accès carte des lieux'))

    expect(analytics.logConsultVenueMap).toHaveBeenCalledWith({ from: 'trend_block' })
  })
})
