import React from 'react'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferAbout } from 'features/offerv2/components/OfferAbout/OfferAbout'
import { render, screen } from 'tests/utils'

describe('<OfferAbout />', () => {
  it('should display about section when offer has a description', () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      description: 'Cette offre est super cool cool cool cool cool cool',
    }
    render(<OfferAbout offer={offer} />)

    expect(screen.getByText('À propos')).toBeOnTheScreen()
  })

  it('should display about section when there is an accessibility section', () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      accessibility: {
        audioDisability: true,
        mentalDisability: true,
        motorDisability: false,
        visualDisability: false,
      },
    }
    render(<OfferAbout offer={offer} />)

    expect(screen.getByText('À propos')).toBeOnTheScreen()
  })

  it('should display about section when there is metadata', () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      description: undefined,
      accessibility: {},
      extraData: {
        speaker: 'Toto',
      },
    }

    render(<OfferAbout offer={offer} />)

    expect(screen.getByText('À propos')).toBeOnTheScreen()
  })

  it('should not display about section when there are not description, accessibility section and metadata', () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      description: undefined,
      accessibility: {},
      extraData: {},
    }

    render(<OfferAbout offer={offer} />)

    expect(screen.queryByText('À propos')).not.toBeOnTheScreen()
  })

  describe('Description', () => {
    it('should display description', () => {
      const offer: OfferResponse = {
        ...offerResponseSnap,
        description: 'Cette offre est super cool cool cool cool cool cool',
      }

      render(<OfferAbout offer={offer} />)

      expect(
        screen.getByText('Cette offre est super cool cool cool cool cool cool')
      ).toBeOnTheScreen()
    })

    it('should not display description when no description', () => {
      const offer: OfferResponse = {
        ...offerResponseSnap,
        description: null,
      }
      render(<OfferAbout offer={offer} />)

      expect(screen.queryByText('Description :')).not.toBeOnTheScreen()
    })
  })

  describe('Accessibility section', () => {
    it('should display accessibility when disabilities are defined', () => {
      const offer: OfferResponse = {
        ...offerResponseSnap,
        accessibility: {
          audioDisability: true,
          mentalDisability: true,
          motorDisability: false,
          visualDisability: false,
        },
      }

      render(<OfferAbout offer={offer} />)

      expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    })

    it('should not display accessibility when disabilities are not defined', () => {
      const offer: OfferResponse = {
        ...offerResponseSnap,
        accessibility: {},
      }

      render(<OfferAbout offer={offer} />)

      expect(screen.queryByText('Handicap visuel')).not.toBeOnTheScreen()
      expect(screen.queryByText('Accessibilité de l’offre')).not.toBeOnTheScreen()
    })
  })

  it('should display offer editor when offer has it', () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      extraData: {
        editeur: 'Gallimard',
      },
    }

    render(<OfferAbout offer={offer} />)

    expect(screen.queryByText('Éditeur :')).toBeOnTheScreen()
  })

  it('should not display offer editor when offer has not it', async () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      extraData: {},
    }
    render(<OfferAbout offer={offer} />)

    expect(screen.queryByText('Éditeur :')).not.toBeOnTheScreen()
    expect(screen.queryByText('Gallimard')).not.toBeOnTheScreen()
  })
})
