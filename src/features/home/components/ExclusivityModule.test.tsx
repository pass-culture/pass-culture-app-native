import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'

import { ExclusivityModule } from './ExclusivityModule'

const props = {
  alt: "Image d'Adèle",
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  offerId: 'AZBE',
  moduleId: 'module-id',
}
describe('ExclusivityModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<ExclusivityModule {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', async () => {
    const { getByTestId } = render(<ExclusivityModule {...props} />)
    fireEvent.press(getByTestId('imageExclu'))
    expect(navigate).toHaveBeenCalledWith('Offer', { offerId: 'AZBE' })
  })
})
