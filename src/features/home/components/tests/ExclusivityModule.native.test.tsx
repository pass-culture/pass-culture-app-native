import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferResponse } from 'api/gen'
import * as excluOfferAPI from 'features/home/api/useExcluOffer'
import { ContentTypes } from 'features/home/contentful'
import { offerResponseSnap as mockOffer } from 'features/offer/api/snaps/offerResponseSnap'
import { analytics } from 'libs/firebase/analytics'
import { render, fireEvent } from 'tests/utils'

import { ExclusivityModule, ExclusivityModuleProps } from '../ExclusivityModule'

jest.mock('features/auth/settings')
jest.mock('features/search/utils/useMaxPrice', () => ({ useMaxPrice: jest.fn(() => 300) }))

const props: ExclusivityModuleProps = {
  title: "Image d'Adèle",
  alt: "Image d'Adèle",
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  id: mockOffer.id,
  moduleId: 'module-id',
  display: { isGeolocated: false, aroundRadius: undefined, title: '' },
  homeEntryId: 'abcd',
  index: 1,
}

const mockPosition = {
  latitude: mockOffer.venue.coordinates.latitude || 0 + 0.0001,
  longitude: mockOffer.venue.coordinates.latitude || 0 + 0.0001,
}
jest.mock('libs/geolocation', () => ({ useGeolocation: () => ({ position: mockPosition }) }))

describe('ExclusivityModule component', () => {
  const excluOfferAPISpy = jest.spyOn(excluOfferAPI, 'useExcluOffer')
  beforeEach(() => {
    excluOfferAPISpy.mockImplementation(() => {
      return {
        isLoading: false,
        data: mockOffer,
      } as UseQueryResult<OfferResponse>
    })
  })
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = renderExclusivityModule(props)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', () => {
    const { getByTestId } = renderExclusivityModule(props)
    fireEvent.press(getByTestId('imageExclu'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: mockOffer.id,
      from: 'home',
    })
  })

  it('should log a click event when clicking on the image', () => {
    const { getByTestId } = renderExclusivityModule(props)
    fireEvent.press(getByTestId('imageExclu'))
    expect(analytics.logClickExclusivityBlock).toHaveBeenCalledWith({
      moduleName: props.title,
      moduleId: props.moduleId,
    })
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId: mockOffer.id,
      moduleName: props.title,
      moduleId: props.moduleId,
      from: 'exclusivity',
    })
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', () => {
    renderExclusivityModule(props)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
      1,
      props.moduleId,
      ContentTypes.EXCLUSIVITY,
      props.index,
      props.homeEntryId
    )
  })

  it('should not trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', () => {
    excluOfferAPISpy.mockImplementationOnce(() => {
      return {
        isLoading: false,
        data: undefined,
      } as UseQueryResult<OfferResponse>
    })
    renderExclusivityModule(props)

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })
})

const renderExclusivityModule = (props: ExclusivityModuleProps) => {
  return render(<ExclusivityModule {...props} />)
}
