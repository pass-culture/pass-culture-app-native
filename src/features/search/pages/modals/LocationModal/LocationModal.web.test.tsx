import React from 'react'

import { FilterBehaviour } from 'features/search/enums'
import {
  LocationModal,
  LocationModalProps,
} from 'features/search/pages/modals/LocationModal/LocationModal'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Position } from 'libs/location'
import { act, checkAccessibilityFor, fireEvent, render, screen, waitFor } from 'tests/utils/web'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const mockPosition: Position = { latitude: 2, longitude: 40 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
  }),
}))

const hideModal = jest.fn()

describe('<LocationModal/>', () => {
  describe('modal header', () => {
    it('should have header when viewport width is desktop', async () => {
      const isDesktopViewport = true
      renderLocationModal({ hideModal }, isDesktopViewport)

      await act(async () => {}) // Warning: An update to LocationModal inside a test was not wrapped in act(...).

      const header = screen.queryByTestId('pageHeader')
      await waitFor(() => {
        expect(header).toBeInTheDocument()
      })
    })
  })

  it('should close the modal when clicking close button', async () => {
    const isDesktopViewport = true
    renderLocationModal({ hideModal }, isDesktopViewport)

    await act(async () => {
      const closeButton = screen.getByRole('button', { name: 'Fermer' })
      fireEvent.click(closeButton)
    })

    expect(hideModal).toHaveBeenCalledTimes(1)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderLocationModal({})
      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})

function renderLocationModal(
  { hideModal = () => {}, filterBehaviour = FilterBehaviour.SEARCH }: Partial<LocationModalProps>,
  isDesktopViewport?: boolean
) {
  return render(
    <LocationModal
      title="Localisation"
      accessibilityLabel="Ne pas filtrer sur la localisation et retourner aux résultats"
      isVisible
      hideModal={hideModal}
      filterBehaviour={filterBehaviour}
    />,
    { theme: { isDesktopViewport } }
  )
}
