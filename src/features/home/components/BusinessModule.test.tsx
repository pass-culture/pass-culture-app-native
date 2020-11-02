import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { BusinessModule } from './BusinessModule'

const props = {
  firstLine: 'firstLine',
  secondLine: 'secondLine',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  url: 'url',
}
describe('BusinessModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<BusinessModule {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  // Temporary test. We have to adapt it with navigation once implemented
  it('should navigate to the offer when clicking on the image', async () => {
    global.console = { ...global.console, log: jest.fn() }
    const { getByTestId } = render(<BusinessModule {...props} />)
    fireEvent.press(getByTestId('imageBusiness'))
    expect(console.log).toHaveBeenCalledWith('Opening url') // eslint-disable-line no-console
  })
})
