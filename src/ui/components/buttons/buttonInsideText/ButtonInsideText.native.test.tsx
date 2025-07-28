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

      expect(screen.getByTestId('button-icon')).toBeOnTheScreen()
    })
  })

  describe('* typography property', () => {
    it('should display ButtonText font family when not provided', () => {
      render(<ButtonInsideText wording={wording} />)

      expect(screen.getByText(wording)).toHaveStyle({
        fontFamily: theme.designSystem.typography.button.fontFamily,
      })
    })

    it('should display Caption font family when Caption provided', () => {
      render(<ButtonInsideText wording={wording} typography="BodyAccentXs" />)

      expect(screen.getByText(wording)).toHaveStyle({
        fontFamily: theme.designSystem.typography.bodyAccentXs.fontFamily,
      })
    })
  })

  describe('* color property', () => {
    it('should display primary color when not provided', () => {
      render(<ButtonInsideText wording={wording} />)

      expect(screen.getByText(wording)).toHaveStyle({
        color: theme.designSystem.color.background.brandPrimary,
      })
    })

    it('should display custom color when color provided', () => {
      render(
        <ButtonInsideText
          wording={wording}
          buttonColor={theme.designSystem.color.background.success}
        />
      )

      expect(screen.getByText(wording)).toHaveStyle({
        color: theme.designSystem.color.background.success,
      })
    })
  })
})
