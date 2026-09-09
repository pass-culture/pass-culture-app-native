import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { LocationMode } from 'libs/location/types'
import { locationActions } from 'libs/locationV2/location.store'
import { locationModalSelectors } from 'libs/locationV2/locationModal.store'
import { requestGeolocPermission } from 'libs/locationV2/requestGeolocPermission'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, within } from 'tests/utils/web'

jest.mock('libs/locationV2/requestGeolocPermission')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

const mockRequestPermission = jest.mocked(requestGeolocPermission)

describe('LocationModal keyboard navigation', () => {
  beforeEach(() => {
    locationActions.setLocationMode(LocationMode.EVERYWHERE)
  })

  it('selects a geographic area and keeps its address input usable', async () => {
    const user = await userEvent.setup()
    render(reactQueryProviderHOC(<LocationModal from="home" />))
    const group = screen.getByRole('radiogroup', { name: 'Sélectionne ta localisation' })
    const selected = within(group).getByRole('radio', { checked: true })
    act(() => selected.focus())

    await user.keyboard('[ArrowUp]')

    const area = within(group).getByRole('radio', {
      name: 'Choisir une zone géographique - Ville, code postal, adresse',
    })

    expect(area).toBeChecked()
    expect(locationModalSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)

    await user.tab()
    const input = screen.getByRole('searchbox')

    await user.keyboard('[ArrowLeft][ArrowRight]')

    expect(input).toHaveFocus()
    expect(locationModalSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)
    expect(mockRequestPermission).not.toHaveBeenCalled()
  })

  it('checks the current position only after permission succeeds', async () => {
    const user = await userEvent.setup()
    let acceptPermission: (() => void) | undefined
    mockRequestPermission.mockImplementationOnce(async ({ onSuccess } = {}) => {
      await new Promise<void>((resolve) => {
        acceptPermission = () => {
          onSuccess?.()
          resolve()
        }
      })
    })
    render(reactQueryProviderHOC(<LocationModal from="home" />))
    act(() => screen.getByRole('radio', { checked: true }).focus())

    await user.keyboard('[ArrowRight]')

    const currentPosition = screen.getByRole('radio', { name: /^Utiliser ma position actuelle/ })

    expect(currentPosition).toHaveFocus()
    expect(currentPosition).not.toBeChecked()
    expect(locationModalSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)

    await act(async () => {
      acceptPermission?.()
      await Promise.resolve()
    })

    expect(currentPosition).toHaveFocus()
    expect(currentPosition).toBeChecked()
    expect(locationModalSelectors.selectLocationMode()).toBe(LocationMode.AROUND_ME)
  })

  it('preserves the selected mode when permission is denied and can continue navigating', async () => {
    const user = await userEvent.setup()
    mockRequestPermission.mockResolvedValueOnce(undefined)
    render(reactQueryProviderHOC(<LocationModal from="home" />))
    act(() => screen.getByRole('radio', { checked: true }).focus())

    await user.keyboard('[ArrowRight]')

    expect(screen.getByRole('radio', { name: /^Utiliser ma position actuelle/ })).not.toBeChecked()
    expect(locationModalSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)

    await user.keyboard('[ArrowRight]')

    expect(screen.getByRole('radio', { name: /^Choisir une zone géographique/ })).toHaveFocus()
    expect(locationModalSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)
  })
})
