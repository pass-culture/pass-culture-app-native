import React from 'react'

import { VideoEndView } from 'features/home/components/modules/video/VideoEndView'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockReplay = jest.fn()
const mockHideModal = jest.fn()
const mockOffer = mockedAlgoliaResponse.hits[0]

describe('VideoEndView', () => {
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
})

const renderVideoEndView = async () => {
  const viewDimensions = { height: 100, width: 100 }
  render(
    <VideoEndView
      onPressReplay={mockReplay}
      offer={mockOffer}
      onPressSeeOffer={mockHideModal}
      style={viewDimensions}
    />,
    {
      /* eslint-disable local-rules/no-react-query-provider-hoc */
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )

  await act(async () => {})
}
