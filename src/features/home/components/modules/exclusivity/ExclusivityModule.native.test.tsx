import React from 'react'
import { UseQueryResult } from 'react-query'

import { OfferResponseV2 } from 'api/gen'
import { ExclusivityModuleProps } from 'features/home/components/modules/exclusivity/types'
import * as useExcluOfferQueryAPI from 'features/home/queries/useExcluOfferQuery'
import { offerResponseSnap as mockOffer } from 'features/offer/fixtures/offerResponse'
import { render, screen } from 'tests/utils'

import { ExclusivityModule } from './ExclusivityModule'

jest.mock('features/search/helpers/useMaxPrice/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => 300_00),
}))

const useExcluOfferQuerySpy = jest.spyOn(useExcluOfferQueryAPI, 'useExcluOfferQuery')
useExcluOfferQuerySpy.mockImplementation(() => {
  return {
    isLoading: false,
    data: mockOffer,
  } as unknown as UseQueryResult<OfferResponseV2>
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

jest.mock('libs/firebase/analytics/analytics')

describe('ExclusivityModule component', () => {
  it('should render ExclusivityOffer component when an offer id is provided', () => {
    render(<ExclusivityModule {...props} />)

    expect(screen.getByTestId('Image d’Adèle')).toBeOnTheScreen()
  })

  it('should render ExclusivityExternalLink component when url is provided', () => {
    render(<ExclusivityModule {...props} offerId={undefined} url="http://toto.com" />)

    expect(screen.getByTestId('Image d’Adèle')).toBeOnTheScreen()
  })

  it('should render ExclusivityBanner component when no offer id nor url is provided', () => {
    render(<ExclusivityModule {...props} offerId={undefined} />)

    expect(screen.getByTestId('exclusivity-banner')).toBeOnTheScreen()
  })
})
