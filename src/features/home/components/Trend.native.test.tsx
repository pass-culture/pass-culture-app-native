import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { Trend } from 'features/home/components/Trend'
import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'
import { TrendBlock } from 'features/home/types'
import { fireEvent, render, screen } from 'tests/utils'

describe('Trend', () => {
  it('should redirect to VenueMap when content type is venue map block', () => {
    const venueMapBlock = formattedTrendsModule.items[0] as TrendBlock
    render(<Trend {...venueMapBlock} />)

    fireEvent.press(screen.getByText('Accès carte des lieux'))

    expect(navigate).toHaveBeenCalledWith('VenueMap', undefined)
  })

  it('should redirect to thematic home when content type is trend block', () => {
    const trendBlock = formattedTrendsModule.items[1] as TrendBlock
    render(<Trend {...trendBlock} />)

    fireEvent.press(screen.getByText('Tendance 1'))

    expect(navigate).toHaveBeenCalledWith('ThematicHome', { homeId: '7qcfqY5zFesLVO5fMb4cqm' })
  })
})
