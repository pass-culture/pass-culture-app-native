import React from 'react'

import { LocationModal } from 'features/search/pages/modals/LocationModal/LocationModal'
import { GeoCoordinates } from 'libs/geolocation'
import { act, checkAccessibilityFor, fireEvent, render, superFlushWithAct } from 'tests/utils/web'

const mockPosition: GeoCoordinates | null = { latitude: 2, longitude: 40 }
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
  }),
}))

const hideLocationModal = jest.fn()

describe('<LocationModal/>', () => {
  describe('modal header', () => {
    it('should have header when viewport width is mobile', async () => {
      const isDesktopViewport = false
      const renderAPI = renderLocationModal({ hideLocationModal }, isDesktopViewport)

      const header = renderAPI.queryByTestId('pageHeader')

      await act(async () => {
        expect(header).toBeTruthy()
      })
    })

    it('should not have header when viewport width is desktop', async () => {
      const isDesktopViewport = true
      const renderAPI = renderLocationModal(
        {
          hideLocationModal,
        },
        isDesktopViewport
      )

      const header = renderAPI.queryByTestId('pageHeader')
      await act(async () => {
        expect(header).toBeFalsy()
      })
    })
  })

  it('should close the modal when clicking close button', async () => {
    const isDesktopViewport = true
    const { getByTestId } = renderLocationModal(
      {
        hideLocationModal,
      },
      isDesktopViewport
    )

    await superFlushWithAct()

    const closeButton = getByTestId('Ne pas filtrer sur la localisation et retourner aux résultats')
    fireEvent.click(closeButton)

    expect(hideLocationModal).toHaveBeenCalledTimes(1)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderLocationModal({
        hideLocationModal,
      })
      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})

type Props = {
  hideLocationModal: () => void
}

function renderLocationModal({ hideLocationModal }: Props, isDesktopViewport?: boolean) {
  return render(
    <LocationModal
      title="Localisation"
      accessibilityLabel="Ne pas filtrer sur la localisation et retourner aux résultats"
      isVisible
      hideModal={hideLocationModal}
    />,
    { theme: { isDesktopViewport } }
  )
}
