import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferVideoModule } from 'features/home/components/modules/OfferVideoModule'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockOffer = mockedAlgoliaResponse.hits[0]

const hideModalMock = jest.fn()

describe('OfferVideoModule', () => {
  it('should redirect to an offer when pressing it', async () => {
    render(<OfferVideoModule offer={mockOffer} color="" hideModal={hideModalMock} />, {
      /* eslint-disable local-rules/no-react-query-provider-hoc */
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    fireEvent.press(screen.getByText('La nuit des temps'))
    await act(async () => {})

    expect(navigate).toHaveBeenCalledWith('Offer', { id: 102_280 })
  })
})
