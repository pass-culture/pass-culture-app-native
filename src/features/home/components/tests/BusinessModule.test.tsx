import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'

import { BusinessModule } from '../BusinessModule'

const props = {
  firstLine: 'firstLine',
  secondLine: 'secondLine',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  url: 'url',
  moduleId: 'module-id',
  targetNotConnectedUsersOnly: undefined,
  leftIcon: undefined,
}
describe('BusinessModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly - with leftIcon = Idea by default', () => {
    const { toJSON } = render(<BusinessModule {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly - with leftIcon provided', () => {
    const { toJSON } = render(
      <BusinessModule
        {...props}
        leftIcon="https://images.ctfassets.net/2bg01iqy0isv/1Sh2Ter3f4GgW9m926jqB5/83adbbd38e399d0089ff7b8f0efadf4c/Europe.png"
      />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should open url when clicking on the image', async () => {
    const { getByTestId } = render(<BusinessModule {...props} />)
    const openUrlSpy = jest.spyOn(Linking, 'openURL')
    fireEvent.press(getByTestId('imageBusiness'))
    expect(openUrlSpy).toHaveBeenCalledWith('url')
  })
})
