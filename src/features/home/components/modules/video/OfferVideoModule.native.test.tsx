import { omit } from 'lodash'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferVideoModule } from 'features/home/components/modules/video/OfferVideoModule'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockOffer = mockedAlgoliaResponse.hits[0]

const props = {
  moduleId: 'abcd',
  moduleName: 'salut à tous c’est lujipeka',
  homeEntryId: 'xyz',
}

const hideModalMock = jest.fn()

describe('OfferVideoModule', () => {
  it('should redirect to an offer when pressing it', async () => {
    renderOfferVideoModule()

    fireEvent.press(screen.getByText('La nuit des temps'))
    await act(async () => {})

    expect(navigate).toHaveBeenCalledWith('Offer', { id: 102_280 })
  })

  it('should display a placeholder if the offer has no image', async () => {
    const offerWithoutImage = omit(mockOffer, 'offer.thumbUrl')
    renderOfferVideoModule(offerWithoutImage)

    await act(async () => {})

    expect(screen.getByTestId('imagePlaceholder')).toBeTruthy()
  })

  it('should log ConsultOffer on when pressing it', async () => {
    renderOfferVideoModule()

    fireEvent.press(screen.getByText('La nuit des temps'))
    await act(async () => {})

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      from: 'home',
      offerId: +mockOffer.objectID,
      moduleId: props.moduleId,
      moduleName: props.moduleName,
      homeEntryId: props.homeEntryId,
    })
  })
})

function renderOfferVideoModule(offer?: Offer) {
  render(
    <OfferVideoModule
      offer={offer ?? mockOffer}
      color=""
      hideModal={hideModalMock}
      analyticsFrom={'home'}
      {...props}
    />,
    {
      /* eslint-disable local-rules/no-react-query-provider-hoc */
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
}
