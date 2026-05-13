import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { api } from 'api/api'
import { act, render, screen, userEvent } from 'tests/utils'
import * as snackBarStoreModule from 'ui/designSystem/Snackbar/snackBar.store'

import { CheatcodesScreenDirectIdAccess } from './CheatcodesScreenDirectIdAccess'

jest.mock('@react-navigation/native')

const mockNavigate = jest.fn()
const mockUseNavigation = useNavigation as jest.Mock
mockUseNavigation.mockReturnValue({ navigate: mockNavigate })

const mockShowErrorSnackBar = jest.spyOn(snackBarStoreModule, 'showErrorSnackBar')

const user = userEvent.setup()

describe('<CheatcodesScreenDirectIdAccess />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should disable the navigate button when no id is entered', () => {
    render(<CheatcodesScreenDirectIdAccess />)

    const goButton = screen.getByText('Y aller')

    expect(goButton).toBeDisabled()
  })

  it('should disable the navigate button for a non-numeric offer id', async () => {
    render(<CheatcodesScreenDirectIdAccess />)

    await user.type(screen.getByLabelText(/Identifiant offre/), 'not-a-number')

    expect(screen.getByText('Y aller')).toBeDisabled()
  })

  it('should navigate to Offer when API validation succeeds', async () => {
    jest.spyOn(api, 'getNativeV3OfferofferId').mockResolvedValueOnce({} as never)

    render(<CheatcodesScreenDirectIdAccess />)

    await user.type(screen.getByLabelText(/Identifiant offre/), '283')
    await act(async () => {
      await user.press(screen.getByText('Y aller'))
    })

    expect(api.getNativeV3OfferofferId).toHaveBeenCalledWith(283)
    expect(mockNavigate).toHaveBeenCalledWith('Offer', { id: 283, from: 'deeplink' })
    expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
  })

  it('should show an error snackbar and not navigate when API validation fails', async () => {
    jest.spyOn(api, 'getNativeV3OfferofferId').mockRejectedValueOnce(new Error('Offer not found'))

    render(<CheatcodesScreenDirectIdAccess />)

    await user.type(screen.getByLabelText(/Identifiant offre/), '999999')
    await act(async () => {
      await user.press(screen.getByText('Y aller'))
    })

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith(expect.stringContaining('Offre introuvable'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should navigate to Venue when API validation succeeds', async () => {
    jest.spyOn(api, 'getNativeV2VenuevenueId').mockResolvedValueOnce({} as never)

    render(<CheatcodesScreenDirectIdAccess />)

    await user.press(screen.getByText('Lieu'))
    await user.type(screen.getByLabelText(/Identifiant lieu/), '42')
    await act(async () => {
      await user.press(screen.getByText('Y aller'))
    })

    expect(api.getNativeV2VenuevenueId).toHaveBeenCalledWith(42)
    expect(mockNavigate).toHaveBeenCalledWith('Venue', { id: 42, from: 'deeplink' })
    expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
  })

  it('should navigate to Artist without API validation', async () => {
    render(<CheatcodesScreenDirectIdAccess />)

    await user.press(screen.getByText('Artiste'))
    await user.type(screen.getByLabelText(/Identifiant artiste/), 'artist-slug')
    await act(async () => {
      await user.press(screen.getByText('Y aller'))
    })

    expect(mockNavigate).toHaveBeenCalledWith('Artist', { id: 'artist-slug' })
  })
})
