import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { ExclusivityModule } from './ExclusivityModule'

const props = {
  alt: "Image d'Adèle",
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  offerId: 'AZBE',
}
describe('ExclusivityModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<ExclusivityModule {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  // Temporary test. We have to adapt it with navigation once implemented
  it('should navigate to the offer when clicking on the image', async () => {
    global.console = { ...global.console, log: jest.fn() }
    const { getByTestId } = render(<ExclusivityModule {...props} />)
    fireEvent.press(getByTestId('imageExclu'))
    expect(console.log).toHaveBeenCalledWith('Opening offer AZBE...') // eslint-disable-line no-console
  })
})
