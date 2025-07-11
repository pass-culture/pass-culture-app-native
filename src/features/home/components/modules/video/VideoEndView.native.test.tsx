import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoEndView } from 'features/home/components/modules/video/VideoEndView'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockReplay = jest.fn()
const mockHideModal = jest.fn()
const mockOffer = mockedAlgoliaResponse.hits[0]

describe('VideoEndView', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should replay video when pressing replay button', async () => {
    renderVideoEndView()

    const replayButton = await screen.findByText('Revoir')
    // userEvent.press is not working correctly
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(replayButton)

    await waitFor(() => expect(mockReplay).toHaveBeenCalledTimes(1))
  })

  it('should hide modal page when pressing "Voir l’offre" button', async () => {
    renderVideoEndView()

    const seeOfferButton = await screen.findByText('Voir l’offre')
    // userEvent.press is not working correctly
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(seeOfferButton)

    await waitFor(() => expect(mockHideModal).toHaveBeenCalledTimes(1))
  })

  it('should log ConsultOffer when pressing "Voir l’offre" button', async () => {
    renderVideoEndView()

    const seeOfferButton = await screen.findByText('Voir l’offre')
    // userEvent.press is not working correctly
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(seeOfferButton)

    await waitFor(() =>
      expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
        from: 'video',
        offerId: +mockOffer.objectID,
        moduleId: 'abcd',
        moduleName: 'salut à tous c’est lujipeka',
        homeEntryId: 'xyz',
      })
    )
  })
})

const renderVideoEndView = async () => {
  const viewDimensions = { height: 100, width: 100 }
  render(
    <VideoEndView
      onPressReplay={mockReplay}
      offer={mockOffer}
      onPressSeeOffer={mockHideModal}
      style={viewDimensions}
      moduleId="abcd"
      moduleName="salut à tous c’est lujipeka"
      homeEntryId="xyz"
    />,
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
}
