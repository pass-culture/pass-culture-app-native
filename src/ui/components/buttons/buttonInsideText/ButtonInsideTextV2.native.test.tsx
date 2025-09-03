import React from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'

import { ButtonInsideTextV2 } from './ButtonInsideTextV2'

const wording = 'Wording'

describe('ButtonInsideTextV2', () => {
  describe('* typography property', () => {
    it('should display ButtonText font family when not provided', () => {
      render(<ButtonInsideTextV2 wording={wording} />)

      expect(screen.getByText(wording)).toHaveStyle({
        fontFamily: theme.designSystem.typography.button.fontFamily,
      })
    })

    it('should display Caption font family when Caption provided', () => {
      render(<ButtonInsideTextV2 wording={wording} typography="BodyAccentXs" />)

      expect(screen.getByText(wording)).toHaveStyle({
        fontFamily: theme.designSystem.typography.bodyAccentXs.fontFamily,
      })
    })
  })

  describe('* role property', () => {
    it('should have correct accessibilityRole when not provided', async () => {
      render(<ButtonInsideTextV2 wording={wording} />)

      const linkBanner = await screen.findByRole(AccessibilityRole.BUTTON)

      expect(linkBanner).toBeTruthy()
    })

    it('should have correct accessibilityRole role when link type provided', async () => {
      render(<ButtonInsideTextV2 wording={wording} type={AccessibilityRole.LINK} />)

      const linkBanner = await screen.findByRole(AccessibilityRole.LINK)

      expect(linkBanner).toBeTruthy()
    })
  })
})
