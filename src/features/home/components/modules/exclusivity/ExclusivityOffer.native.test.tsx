import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferResponseV2 } from 'api/gen'
import * as excluOfferAPI from 'features/home/api/useExcluOffer'
import { ExclusivityOffer } from 'features/home/components/modules/exclusivity/ExclusivityOffer'
import { offerResponseSnap as mockOffer } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/search/helpers/useMaxPrice/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => 300_00),
}))

const props = {
  title: 'Image d’Adèle',
  alt: 'Image d’Adèle',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  offerId: mockOffer.id,
  moduleId: 'module-id',
  display: { isGeolocated: false, aroundRadius: undefined, title: '' },
  homeEntryId: 'abcd',
  index: 1,
}

describe('ExclusivityModule component', () => {
  const excluOfferAPISpy = jest.spyOn(excluOfferAPI, 'useExcluOffer')

  beforeEach(() => {
    excluOfferAPISpy.mockImplementation(() => {
      return {
        isLoading: false,
        data: mockOffer,
      } as unknown as UseQueryResult<OfferResponseV2>
    })
  })

  afterAll(() => jest.resetAllMocks())

  it('should navigate to the offer when clicking on the image', () => {
    render(<ExclusivityOffer {...props} />)
    fireEvent.press(screen.getByTestId('Image d’Adèle'))

    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: mockOffer.id,
      from: 'home',
    })
  })

  it('should log a click event when clicking on the image', () => {
    render(<ExclusivityOffer {...props} />)
    fireEvent.press(screen.getByTestId('Image d’Adèle'))

    expect(analytics.logExclusivityBlockClicked).toHaveBeenCalledWith({
      moduleName: props.title,
      moduleId: props.moduleId,
      homeEntryId: props.homeEntryId,
    })
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId: mockOffer.id,
      moduleName: props.title,
      moduleId: props.moduleId,
      homeEntryId: props.homeEntryId,
      from: 'exclusivity',
    })
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', () => {
    render(<ExclusivityOffer {...props} />)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: props.moduleId,
      moduleType: ContentTypes.EXCLUSIVITY,
      index: props.index,
      homeEntryId: props.homeEntryId,
      offers: ['116656'],
    })
  })

  it('should not trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', () => {
    excluOfferAPISpy.mockImplementationOnce(() => {
      return {
        isLoading: false,
        data: undefined,
      } as UseQueryResult<OfferResponseV2>
    })
    render(<ExclusivityOffer {...props} />)

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })
})
