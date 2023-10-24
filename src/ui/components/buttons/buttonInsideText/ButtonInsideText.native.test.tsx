import React from 'react'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

import { ButtonInsideText } from './ButtonInsideText'

const wording = 'Wording'

describe('ButtonInsideText Component', () => {
  describe('* Icon property', () => {
    it('should not display icon when not provided', () => {
      render(<ButtonInsideText wording={wording} />)

      expect(screen.queryByTestId('button-icon')).not.toBeOnTheScreen()
    })

    it('should display icon when provided', () => {
      render(<ButtonInsideText wording={wording} icon={ExternalSiteFilled} />)

      expect(screen.queryByTestId('button-icon')).toBeOnTheScreen()
    })
  })

  describe('* typography property', () => {
    it('should display ButtonText font family when not provided', () => {
      render(<ButtonInsideText wording={wording} />)
      const buttonFontFamily = screen.getByText(wording).props.style[0].fontFamily

      expect(buttonFontFamily).toBe(theme.typography.buttonText.fontFamily)
    })

    it('should display Caption font family when Caption provided', () => {
      render(<ButtonInsideText wording={wording} typography="Caption" />)
      const buttonFontFamily = screen.getByText(wording).props.style[0].fontFamily

      expect(buttonFontFamily).toBe(theme.typography.caption.fontFamily)
    })
  })

  describe('* color property', () => {
    it('should display primary color when not provided', () => {
      render(<ButtonInsideText wording={wording} />)
      const buttonColor = screen.getByText(wording).props.style[0].color

      expect(buttonColor).toBe(theme.colors.primary)
    })

    it('should display custom color when color provided', () => {
      render(<ButtonInsideText wording={wording} buttonColor={theme.colors.greenValid} />)

      const buttonColor = screen.getByText(wording).props.style[0].color

      expect(buttonColor).toBe(theme.colors.greenValid)
    })
  })
})
