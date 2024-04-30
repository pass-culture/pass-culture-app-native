import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { analytics } from 'libs/analytics'
import { render, screen, fireEvent, waitFor } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<OfferArtists />', () => {
  it('should display artists', () => {
    render(<OfferArtists artists="Edith Piaf" />)

    expect(screen.getByText('de Edith Piaf')).toBeOnTheScreen()
  })

  it('should display clickable artist button when param to display fake door activated', () => {
    render(<OfferArtists artists="Edith Piaf" shouldDisplayFakeDoor />)

    expect(screen.getByText('Edith Piaf')).toBeOnTheScreen()
  })

  it('should not display clickable artist button when param to display fake door deactivated', () => {
    render(<OfferArtists artists="Edith Piaf" />)

    expect(screen.queryByText('Edith Piaf')).not.toBeOnTheScreen()
  })

  it('should open fake door modal when pressing artist button', () => {
    render(<OfferArtists artists="Edith Piaf" shouldDisplayFakeDoor />)

    fireEvent.press(screen.getByText('Edith Piaf'))

    expect(screen.getByText('Encore un peu de patience…')).toBeOnTheScreen()
  })

  it('should log artist fake door consultation when pressing artist button', () => {
    render(<OfferArtists artists="Edith Piaf" shouldDisplayFakeDoor />)

    fireEvent.press(screen.getByText('Edith Piaf'))

    expect(analytics.logConsultArtistFakeDoor).toHaveBeenCalledTimes(1)
  })

  it('should open fake door qualtrics quizz', async () => {
    render(<OfferArtists artists="Edith Piaf" shouldDisplayFakeDoor />)

    fireEvent.press(screen.getByText('Edith Piaf'))
    fireEvent.press(screen.getByText('Répondre au questionnaire'))
    await waitFor(() => {
      expect(openUrl).toHaveBeenNthCalledWith(
        1,
        'https://passculture.qualtrics.com/jfe/form/SV_6xRze4sgvlbHNd4',
        undefined,
        true
      )
    })
  })
})
