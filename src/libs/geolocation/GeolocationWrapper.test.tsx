import { act } from '@testing-library/react-hooks'
import { render } from '@testing-library/react-native'
import React from 'react'
import { Platform, View } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { flushAllPromises } from 'tests/utils'

import { GeolocationWrapper, useGeolocation } from './GeolocationWrapper'
import {
  EiffelTourCoordinates,
  getCurrentPositionFail,
  getCurrentPositionSuccess,
} from './tests.utils'

const ChildComponent = () => {
  const geolocation = useGeolocation()
  return <View testID="childComponent">{JSON.stringify(geolocation)}</View>
}

async function renderComponent() {
  const renderAPI = render(<ChildComponent />, { wrapper: GeolocationWrapper })
  await act(async () => {
    await flushAllPromises()
  })
  return renderAPI
}

describe('useGeolocation Android', () => {
  beforeAll(() => (Platform.OS = 'android'))
  afterEach(() => jest.resetAllMocks())

  it('should resolve with the geolocation when permission request is accepted', async () => {
    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionSuccess)

    const component = await renderComponent()

    expect(getCurrentPosition).toHaveBeenCalled()
    expect(component.getByTestId('childComponent').props.children).toEqual(
      JSON.stringify(EiffelTourCoordinates)
    )
  })
  it('should reject with empty coordinates when permission request is rejected', async () => {
    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionFail)

    const component = await renderComponent()

    expect(getCurrentPosition).toHaveBeenCalled()
    expect(component.getByTestId('childComponent').props.children).toEqual(JSON.stringify(null))
  })
})
