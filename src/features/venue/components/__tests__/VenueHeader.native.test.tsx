import React from 'react'
import { Animated } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { goBack } from '__mocks__/@react-navigation/native'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { VenueHeader } from '../VenueHeader'

describe('<VenueHeader />', () => {
  it('should render correctly', async () => {
    const { toJSON } = await renderVenueHeader()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render all icons', async () => {
    const venueHeader = await renderVenueHeader()
    expect(venueHeader.queryByTestId('icon-back')).toBeTruthy()
    expect(venueHeader.queryByTestId('icon-share')).toBeTruthy()
  })

  it('should goBack when we press on the back button', async () => {
    const { getByTestId } = await renderVenueHeader()
    fireEvent.press(getByTestId('icon-back'))
    expect(goBack).toBeCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', async () => {
    const { animatedValue, getByTestId } = await renderVenueHeader()
    expect(getByTestId('venueHeaderName').props.style.opacity).toBe(0)
    Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
    await waitForExpect(() => expect(getByTestId('venueHeaderName').props.style.opacity).toBe(1))
  })
})

async function renderVenueHeader() {
  const animatedValue = new Animated.Value(0)
  const wrapper = render(
    reactQueryProviderHOC(
      <VenueHeader
        headerTransition={animatedValue}
        title={venueResponseSnap.name}
        venueId={venueResponseSnap.id}
      />
    )
  )
  return { ...wrapper, animatedValue }
}
