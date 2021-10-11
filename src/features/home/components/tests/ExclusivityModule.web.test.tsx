import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { analytics } from 'libs/analytics'
import { render, fireEvent } from 'tests/utils/web'

import { ExclusivityModule } from '../ExclusivityModule'

const offerId = 'AZBE'
const id = dehumanizeId(offerId)

const props = {
  alt: "Image d'Adèle",
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  offerId,
  moduleId: 'module-id',
  display: {},
}

describe('ExclusivityModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const renderAPI = render(<ExclusivityModule {...props} />)
    expect(renderAPI).toMatchSnapshot()
  })

  // FIXME: web integration
  it.skip('should navigate to the offer when clicking on the image [WEB INTEGRATION]', () => {
    const { getByTestId } = render(<ExclusivityModule {...props} />)
    fireEvent.click(getByTestId('imageExclu'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id,
      from: 'home',
    })
  })
  // FIXME: web integration
  it.skip('should log a click event when clicking on the image [WEB INTEGRATION]', () => {
    const { getByTestId } = render(<ExclusivityModule {...props} />)
    fireEvent.click(getByTestId('imageExclu'))
    expect(analytics.logClickExclusivityBlock).toHaveBeenCalledWith(id)
  })
})
