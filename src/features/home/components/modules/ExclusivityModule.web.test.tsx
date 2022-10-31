import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { offerResponseSnap as mockOffer } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/firebase/analytics'
import { render, fireEvent } from 'tests/utils/web'

import { ExclusivityModule, ExclusivityModuleProps } from './ExclusivityModule'

jest.mock('features/auth/settings')
jest.mock('features/search/utils/useMaxPrice', () => ({ useMaxPrice: jest.fn(() => 300) }))
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

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
jest.mock('features/home/api/useExcluOffer', () => ({
  useExcluOffer: () => ({ data: mockOffer }),
}))

describe('ExclusivityModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const renderAPI = renderExclusivityModule()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', () => {
    const { getByTestId } = renderExclusivityModule()
    fireEvent.click(getByTestId('imageExclu'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: mockOffer.id,
      from: 'home',
    })
  })

  it('should log a click event when clicking on the image', () => {
    const { getByTestId } = renderExclusivityModule()
    fireEvent.click(getByTestId('imageExclu'))
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
})

const renderExclusivityModule = () => {
  return render(<ExclusivityModule {...props} />)
}
