import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { HighlightOfferModule } from 'features/home/components/modules/HighlightOfferModule'
import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import { analytics } from 'libs/analytics'
import { offersFixture } from 'shared/offer/offer.fixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const offerFixture = offersFixture[0]
const duoOfferFixture = offersFixture[2]

jest.mock('features/home/api/useHighlightOffer')
const mockUseHighlightOffer = useHighlightOffer as jest.Mock

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
})

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

  it('should send analytics event on offer press', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()

    await act(async () => {
      fireEvent.press(screen.getByText(highlightOfferModuleFixture.offerTitle))
    })

    expect(analytics.logConsultOffer).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId: +offerFixture.objectID,
      from: 'highlightOffer',
      moduleId: 'fH2FmoYeTzZPjhbz4ZHUW',
      moduleName: 'L’offre du moment 💥',
      homeEntryId: 'entryId',
    })
  })

  it('should send analytics event on favorite press', async () => {
    simulateBackend()
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()

    await act(async () => {
      fireEvent.press(screen.getByRole('checkbox', { name: 'Mettre en favoris' }))
    })

    await act(async () => {})

    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledTimes(1)
    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
      offerId: +offerFixture.objectID,
      from: 'highlightOffer',
      moduleId: 'fH2FmoYeTzZPjhbz4ZHUW',
      moduleName: 'L’offre du moment 💥',
    })
  })

  it('should show "- Duo" after price if offer isDuo', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(duoOfferFixture)

    renderHighlightModule()

    await act(async () => {
      expect(screen.getByText('34 € - Duo')).toBeTruthy()
      expect(screen.queryByText('34 €')).toBeNull()
    })
  })

  it('should not show "- Duo" after price if offer is not isDuo', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()

    await act(async () => {
      expect(screen.getByText('28 €')).toBeTruthy()
      expect(screen.queryByText('28 € - Duo')).toBeNull()
    })
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
