import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { analytics } from 'libs/firebase/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { render, waitFor } from 'tests/utils'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')

const mockSubcategories = placeholderData.subcategories
const mockHomepageLabels = placeholderData.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      homepageLabels: mockHomepageLabels,
    },
  }),
}))
const venueId = venueResponseSnap.id

describe('<Venue />', () => {
  it('should match snapshot', async () => {
    const venue = await renderVenue(venueId)
    expect(venue).toMatchSnapshot()
  })

  it('should log consult venue when URL has from param with deeplink', async () => {
    await renderVenue(venueId, 'deeplink')
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId,
      from: 'deeplink',
    })
  })

  it('should not log consult venue when URL has "from" param with something other than deeplink', async () => {
    await renderVenue(venueId, 'search')
    expect(analytics.logConsultVenue).not.toHaveBeenCalled()
  })

  it('should not log consult venue when URL has not "from" param', async () => {
    await renderVenue(venueId)
    expect(analytics.logConsultVenue).not.toHaveBeenCalled()
  })
})

async function renderVenue(id: number, from?: Referrals) {
  useRoute.mockImplementation(() => ({ params: { id, from } }))
  const wrapper = render(<Venue />)
  await waitFor(() => wrapper)
  return wrapper
}
