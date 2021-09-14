import React from 'react'
import { Animated } from 'react-native'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

import { VenueHeader } from '../VenueHeader'

describe('<VenueHeader />', () => {
  it('should render correctly', async () => {
    const renderAPI = await renderVenueHeader()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render back icon', async () => {
    const venueHeader = await renderVenueHeader()
    expect(venueHeader.queryByTestId('icon-back')).toBeTruthy()
  })

  it('should goBack when we press on the back button', async () => {
    const { getByTestId } = await renderVenueHeader()
    fireEvent.click(getByTestId('icon-back'))
    expect(mockGoBack).toBeCalledTimes(1)
  })

  describe('<VenueHeader /> - Analytics', () => {
    it('should log ShareVenue once when clicking on the Share button', async () => {
      const { getByTestId } = await renderVenueHeader()

      fireEvent.click(getByTestId('icon-share'))
      expect(analytics.logShareVenue).toHaveBeenCalledTimes(1)
      expect(analytics.logShareVenue).toHaveBeenCalledWith(venueResponseSnap.id)

      fireEvent.click(getByTestId('icon-share'))
      fireEvent.click(getByTestId('icon-share'))
      expect(analytics.logShareVenue).toHaveBeenCalledTimes(1)
    })
  })
})

async function renderVenueHeader() {
  const animatedValue = new Animated.Value(0)
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <VenueHeader
        headerTransition={animatedValue}
        title={venueResponseSnap.name}
        venueId={venueResponseSnap.id}
      />
    )
  )
}
