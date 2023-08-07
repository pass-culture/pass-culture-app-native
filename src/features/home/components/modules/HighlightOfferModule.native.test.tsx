import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { HighlightOfferModule } from 'features/home/components/modules/HighlightOfferModule'
import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import { analytics } from 'libs/analytics'
import { offersFixture } from 'shared/offer/offer.fixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const offerFixture = offersFixture[0]

jest.mock('features/home/api/useHighlightOffer')
const mockUseHighlightOffer = useHighlightOffer as jest.Mock

describe('HighlightOfferModule', () => {
  it('should navigate to offer page on press', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()
    await act(async () => {
      fireEvent.press(screen.getByText(highlightOfferModuleFixture.offerTitle))
    })

    expect(navigate).toHaveBeenCalledWith('Offer', { id: offerFixture.objectID })
  })

  it('should not render anything when offer is not found', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(undefined)

    renderHighlightModule()

    await act(async () => {})

    expect(screen.queryByText(highlightOfferModuleFixture.highlightTitle)).toBeFalsy()
  })

  it('should send analytics event on module display', async () => {
    renderHighlightModule()

    await act(async () => {})

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledTimes(1)
    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledWith(
      'fH2FmoYeTzZPjhbz4ZHUW',
      'highlightOffer',
      0,
      'entryId'
    )
  })
})

const renderHighlightModule = () => {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <HighlightOfferModule {...highlightOfferModuleFixture} index={0} homeEntryId="entryId" />
    )
  )
}
