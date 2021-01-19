import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { analytics } from 'libs/analytics'

import { ExclusivityModule } from '../ExclusivityModule'

const offerId = 'AZBE'
const id = dehumanizeId(offerId)

const props = {
  alt: "Image d'Adèle",
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  offerId,
  moduleId: 'module-id',
}

describe('ExclusivityModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<ExclusivityModule {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', () => {
    const { getByTestId } = render(<ExclusivityModule {...props} />)
    fireEvent.press(getByTestId('imageExclu'))
    expect(navigate).toHaveBeenCalledWith('Offer', { id })
  })
  it('should log a click event when clicking on the image', () => {
    const { getByTestId } = render(<ExclusivityModule {...props} />)
    fireEvent.press(getByTestId('imageExclu'))
    expect(analytics.logClickExclusivityBlock).toHaveBeenCalledWith(id)
  })
})
