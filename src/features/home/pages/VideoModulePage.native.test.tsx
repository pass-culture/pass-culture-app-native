import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoModulePage } from 'features/home/pages/VideoModulePage'
import { useVideoOffersQuery } from 'features/home/queries/useVideoOffersQuery'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { offersFixture } from 'shared/offer/offer.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('features/home/queries/useVideoOffersQuery')
const mockUseVideoOffersQuery = useVideoOffersQuery as jest.Mock

const mockParams = {
  moduleId: 'module-123',
  moduleName: 'Mon Super Module',
  videoTitle: 'Titre de la vidéo',
  videoTag: 'Cinéma',
  videoPublicationDate: '2023-10-27T10:00:00Z',
  videoDescription: 'Une description sympa',
  offerTitle: 'Les offres à ne pas manquer',
  isMultiOffer: false,
  offersModuleParameters: {},
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('VideoModulePage', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should execute go back when pressing header back button', async () => {
    useRoute.mockReturnValueOnce({
      params: mockParams,
    })
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [...offersFixture] })
    render(reactQueryProviderHOC(<VideoModulePage />))

    await user.press(await screen.findByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should display video description when defined', () => {
    useRoute.mockReturnValueOnce({
      params: mockParams,
    })
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [...offersFixture] })
    render(reactQueryProviderHOC(<VideoModulePage />))

    expect(screen.getByText('Une description sympa')).toBeOnTheScreen()
  })

  it('should display video multi offer list when isMultiOffer is true', () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [...offersFixture] })
    useRoute.mockReturnValueOnce({
      params: { ...mockParams, isMultiOffer: true },
    })
    render(reactQueryProviderHOC(<VideoModulePage />))

    expect(screen.getByText('La nuit des temps')).toBeOnTheScreen()
    expect(screen.getByText('Un lit sous une rivière')).toBeOnTheScreen()
  })

  it('should display video mono offer tile when isMultiOffer is false and there are offers', () => {
    useRoute.mockReturnValueOnce({
      params: mockParams,
    })
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [...offersFixture] })
    render(reactQueryProviderHOC(<VideoModulePage />))

    expect(screen.getByTestId('videoMonoOfferTile')).toBeOnTheScreen()
  })

  describe('should trigger hasDismissedModal log', () => {
    it('When pressing header back button', async () => {
      useRoute.mockReturnValueOnce({
        params: mockParams,
      })
      mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [...offersFixture] })
      render(reactQueryProviderHOC(<VideoModulePage />))

      await user.press(await screen.findByLabelText('Revenir en arrière'))

      expect(analytics.logHasDismissedModal).toHaveBeenCalledWith({
        modalType: 'video',
        moduleId: 'module-123',
        seenDuration: 135,
        videoDuration: 267,
      })
    })

    it('When pressing offer in video multi offer list', async () => {
      mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [...offersFixture] })
      useRoute.mockReturnValueOnce({
        params: { ...mockParams, isMultiOffer: true },
      })
      render(reactQueryProviderHOC(<VideoModulePage />))

      await user.press(await screen.findByText('La nuit des temps'))

      expect(analytics.logHasDismissedModal).toHaveBeenCalledWith({
        modalType: 'video',
        moduleId: 'module-123',
        seenDuration: 135,
        videoDuration: 267,
      })
    })

    it('When pressing offer in video mono offer tile', async () => {
      useRoute.mockReturnValueOnce({
        params: mockParams,
      })
      mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [...offersFixture] })
      render(reactQueryProviderHOC(<VideoModulePage />))

      await user.press(await screen.findByText('La nuit des temps'))

      expect(analytics.logHasDismissedModal).toHaveBeenCalledWith({
        modalType: 'video',
        moduleId: 'module-123',
        seenDuration: 135,
        videoDuration: 267,
      })
    })
  })
})
