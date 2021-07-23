import React from 'react'
import { Animated } from 'react-native'

import { goBack } from '__mocks__/@react-navigation/native'
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
    expect(goBack).toBeCalledTimes(1)
  })
})

async function renderVenueHeader() {
  const animatedValue = new Animated.Value(0)
  const wrapper = render(reactQueryProviderHOC(<VenueHeader headerTransition={animatedValue} />))
  return { ...wrapper, animatedValue }
}
