import React from 'react'

import { FilterBehaviour } from 'features/search/enums'
import {
  LocationModal,
  LocationModalProps,
} from 'features/search/pages/modals/LocationModal/LocationModal'
import { GeoCoordinates } from 'libs/geolocation'
import { act, checkAccessibilityFor, fireEvent, render, waitFor } from 'tests/utils/web'

const mockPosition: GeoCoordinates | null = { latitude: 2, longitude: 40 }
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
  }),
}))

const hideModal = jest.fn()

describe('<LocationModal/>', () => {
  describe('modal header', () => {
    it('should have header when viewport width is mobile', async () => {
      const renderAPI = renderLocationModal({ hideModal })

      const header = renderAPI.queryByTestId('pageHeader')

      await waitFor(() => {
        expect(header).toBeTruthy()
      })
    })

    it('should not have header when viewport width is desktop', async () => {
      const isDesktopViewport = true
      const renderAPI = renderLocationModal({ hideModal }, isDesktopViewport)

      const header = renderAPI.queryByTestId('pageHeader')
      await waitFor(() => {
        expect(header).toBeFalsy()
      })
    })
  })

  it('should close the modal when clicking close button', async () => {
    const isDesktopViewport = true
    const { getByTestId } = renderLocationModal({ hideModal }, isDesktopViewport)

    const closeButton = getByTestId('Ne pas filtrer sur la localisation et retourner aux résultats')
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(hideModal).toHaveBeenCalledTimes(1)
    })
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
