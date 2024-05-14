import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoEndView } from 'features/home/components/modules/video/VideoEndView'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockReplay = jest.fn()
const mockHideModal = jest.fn()
const mockOffer = mockedAlgoliaResponse.hits[0]

describe('VideoEndView', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', placeholderData)
  })

  it('should replay video when pressing replay button', () => {
    renderVideoEndView()

    const replayButton = screen.getByText('Revoir')
    fireEvent.press(replayButton)

    expect(mockReplay).toHaveBeenCalledTimes(1)
  })

  it('should hide modal page when pressing "Voir l’offre" button', () => {
    renderVideoEndView()

    const seeOfferButton = screen.getByText('Voir l’offre')

    fireEvent.press(seeOfferButton)

    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultOffer when pressing "Voir l’offre" button', () => {
    renderVideoEndView()

    const seeOfferButton = screen.getByText('Voir l’offre')

    fireEvent.press(seeOfferButton)

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      from: 'video',
      offerId: +mockOffer.objectID,
      moduleId: 'abcd',
      moduleName: 'salut à tous c’est lujipeka',
      homeEntryId: 'xyz',
    })
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

  await act(async () => {})
}
