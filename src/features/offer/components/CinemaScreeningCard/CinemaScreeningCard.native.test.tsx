import React from 'react'

import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'

import { CinemaScreeningCard } from './CinemaScreeningCard'
import { CinemaScreeningCardBase } from './CinemaScreeningCardBase'
import { CinemaScreeningCardDisabledReason } from './types'

const defaultProps = {
  time: '17h',
  languages: ['VO'],
  price: '25€',
  onPress: jest.fn(),
}

describe('<CinemaScreeningCard />', () => {
  it('should display mandatory information and trigger onPress', async () => {
    const user = userEvent.setup()
    render(<CinemaScreeningCard {...defaultProps} />)

    expect(screen.getByText('17h')).toBeOnTheScreen()
    expect(screen.getByText('VO')).toBeOnTheScreen()
    expect(screen.getByText('25€')).toBeOnTheScreen()

    await user.press(screen.getByLabelText('17h - VO - 25€'))

    expect(defaultProps.onPress).toHaveBeenCalledTimes(1)
  })

  it('should display optional information in video then audio order', () => {
    render(
      <CinemaScreeningCard
        {...defaultProps}
        specialEvent="Avant-première"
        video={['IMAX']}
        audio={['Dolby Atmos']}
      />
    )

    expect(screen.getByText('Avant-première')).toBeOnTheScreen()
    expect(screen.getByText('IMAX')).toBeOnTheScreen()
    expect(screen.getByText('Dolby Atmos')).toBeOnTheScreen()
  })

  it('should display one icon per informed accessibility category', () => {
    render(
      <CinemaScreeningCard
        {...defaultProps}
        accessibility={{ audio: ['GRETA', 'CCAP'], visual: ['value'] }}
      />
    )

    expect(screen.getByTestId('cinema-screening-audio-accessibility')).toBeOnTheScreen()
    expect(screen.getByTestId('cinema-screening-visual-accessibility')).toBeOnTheScreen()
    expect(screen.queryByTestId('cinema-screening-motor-accessibility')).not.toBeOnTheScreen()
  })

  it.each([
    CinemaScreeningCardDisabledReason.UNAVAILABLE,
    CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT,
  ])('should only display time, language and reason when disabled with %s', (disabledReason) => {
    render(
      <CinemaScreeningCard
        {...defaultProps}
        disabledReason={disabledReason}
        specialEvent="Avant-première"
        video={['IMAX']}
        accessibility={{ audio: ['GRETA'] }}
      />
    )

    expect(screen.getByText(disabledReason)).toBeOnTheScreen()
    expect(screen.queryByText('25€')).not.toBeOnTheScreen()
    expect(screen.queryByText('Avant-première')).not.toBeOnTheScreen()
    expect(screen.queryByText('IMAX')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('cinema-screening-audio-accessibility')).not.toBeOnTheScreen()
  })

  it('should expose all content in its accessibility label', () => {
    const accessibilityLabel = '17h - VO - Avant-première - IMAX - Handicap auditif - 25€'
    render(
      <CinemaScreeningCard
        {...defaultProps}
        specialEvent="Avant-première"
        video={['IMAX']}
        accessibility={{ audio: ['GRETA'] }}
      />
    )

    expect(screen.getByLabelText(accessibilityLabel).props.accessibilityLabel).toEqual(
      accessibilityLabel
    )
  })

  it('should apply hover colors without underlining the card content', () => {
    render(<CinemaScreeningCardBase {...defaultProps} hovered />)

    expect(screen.getByLabelText('17h - VO - 25€')).toHaveStyle({
      backgroundColor: theme.designSystem.color.background.hover,
      borderColor: theme.designSystem.color.border.brandPrimaryHover,
      textDecorationLine: 'none',
    })
    expect(screen.getByText('17h')).toHaveStyle({
      color: theme.designSystem.color.text.brandPrimaryHover,
    })
    expect(screen.getByText('VO')).toHaveStyle({
      color: theme.designSystem.color.text.brandPrimaryHover,
    })
    expect(screen.getByText('25€')).toHaveStyle({
      color: theme.designSystem.color.text.brandPrimaryHover,
    })
  })
})
