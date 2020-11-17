import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'

import { BusinessModule } from './BusinessModule'

const props = {
  firstLine: 'firstLine',
  secondLine: 'secondLine',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  url: 'url',
  moduleId: 'module-id',
  targetNotConnectedUsersOnly: undefined,
}
describe('BusinessModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<BusinessModule {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should open url when clicking on the image', async () => {
    const { getByTestId } = render(<BusinessModule {...props} />)
    const openUrlSpy = jest.spyOn(Linking, 'openURL')
    fireEvent.press(getByTestId('imageBusiness'))
    expect(openUrlSpy).toHaveBeenCalledWith('url')
  })
})
