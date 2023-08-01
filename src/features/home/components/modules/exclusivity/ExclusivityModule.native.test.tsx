import React from 'react'
import { UseQueryResult } from 'react-query'

import { OfferResponse } from 'api/gen'
import * as excluOfferAPI from 'features/home/api/useExcluOffer'
import { offerResponseSnap as mockOffer } from 'features/offer/fixtures/offerResponse'
import { render } from 'tests/utils'

import { ExclusivityModule, ExclusivityModuleProps } from './ExclusivityModule'

jest.mock('features/search/helpers/useMaxPrice/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => 300),
}))

const excluOfferAPISpy = jest.spyOn(excluOfferAPI, 'useExcluOffer')
excluOfferAPISpy.mockImplementation(() => {
  return {
    isLoading: false,
    data: mockOffer,
  } as UseQueryResult<OfferResponse>
})

const props: ExclusivityModuleProps = {
  title: 'Image d’Adèle',
  alt: 'Image d’Adèle',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  offerId: mockOffer.id,
  moduleId: 'module-id',
  displayParameters: { isGeolocated: false, aroundRadius: undefined },
  homeEntryId: 'abcd',
  index: 1,
  url: undefined,
}

describe('ExclusivityModule component', () => {
  it('should render ExclusivityOffer component when an offer id is provided', () => {
    const { getByTestId } = render(<ExclusivityModule {...props} />)
    expect(getByTestId('Image d’Adèle')).toBeTruthy()
  })

  it('should render ExclusivityExternalLink component when url is provided', () => {
    const { getByTestId } = render(
      <ExclusivityModule {...props} offerId={undefined} url={'http://toto.com'} />
    )
    expect(getByTestId('Image d’Adèle')).toBeTruthy()
  })

  it('should render ExclusivityBanner component when no offer id nor url is provided', () => {
    const { getByTestId } = render(<ExclusivityModule {...props} offerId={undefined} />)
    expect(getByTestId('exclusivity-banner')).toBeTruthy()
  })
})
