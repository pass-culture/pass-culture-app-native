import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as logClickOnProductAPI from 'libs/algolia/analytics/logClickOnOffer'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { Hit } from './Hit'

const mockHit = mockedAlgoliaResponse.hits[0]
const offerId = Number(mockHit.objectID)

let mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))
jest.mock('react-query')

const spyLogClickOnOffer = jest.fn()
const mockUseLogClickOnOffer = jest.spyOn(logClickOnProductAPI, 'useLogClickOnOffer')
mockUseLogClickOnOffer.mockReturnValue({ logClickOnOffer: spyLogClickOnOffer })

jest.mock('libs/algolia/analytics/SearchAnalyticsWrapper', () => ({
  useSearchAnalyticsState: () => ({ currentQueryID: 'abc123' }),
}))

describe('Hit component', () => {
  it('should navigate to the offer when pressing an hit', async () => {
    render(<Hit hit={mockHit} query="" index={0} searchId="539b285e" />)
    await fireEvent.press(screen.getByRole('link'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'search',
      searchId: '539b285e',
    })
  })

  it('should log analytics event when pressing an hit', async () => {
    render(<Hit hit={mockHit} query="" index={0} />)
    await fireEvent.press(screen.getByRole('link'))
    expect(analytics.logConsultOffer).toBeCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'search',
      query: '',
      offer_display_index: 0,
    })
  })

  it('should notify Algolia when pressing an hit', async () => {
    render(<Hit hit={mockHit} query="" index={0} />)

    const hitComponent = screen.getByRole('link')
    await fireEvent.press(hitComponent)

    expect(spyLogClickOnOffer).toHaveBeenCalledWith({
      objectID: '102280',
      position: 0,
    })
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    render(<Hit hit={mockHit} query="" index={0} />)
    expect(screen.queryByText('10 km')).toBeTruthy()
  })

  describe('When pressing an hit without object id', () => {
    const hit = { ...mockHit, objectID: '' }

    it('should not navigate to the offer', async () => {
      render(<Hit hit={hit} query="" index={0} searchId="539b285e" />)
      await fireEvent.press(screen.getByRole('link'))
      expect(navigate).not.toHaveBeenCalled()
    })

    it('should not log analytics event', async () => {
      render(<Hit hit={hit} query="" index={0} />)
      await fireEvent.press(screen.getByRole('link'))
      expect(analytics.logConsultOffer).not.toHaveBeenCalled()
    })
  })
})
