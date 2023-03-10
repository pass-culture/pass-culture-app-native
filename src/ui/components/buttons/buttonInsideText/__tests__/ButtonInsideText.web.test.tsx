import React from 'react'

import { render, screen } from 'tests/utils/web'
import { theme } from 'theme'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

import { ButtonInsideText } from '../ButtonInsideText'

const wording = 'Wording'

describe('ButtonInsideText Component', () => {
  describe('* Icon property', () => {
    it('should not display icon when not provided', () => {
      render(<ButtonInsideText wording={wording} />)
      expect(screen.queryByTestId('button-icon')).toBeFalsy()
    })
    it('should display icon when provided', () => {
      render(<ButtonInsideText wording={wording} icon={ExternalSiteFilled} />)
      expect(screen.queryByTestId('button-icon')).toBeTruthy()
    })
  })
  describe('* typography property', () => {
    it('should display ButtonText font family when not provided', () => {
      render(<ButtonInsideText wording={wording} />)
      const button = screen.getByText(wording)
      expect(button).toHaveStyle({ fontFamily: theme.typography.buttonText.fontFamily })
    })
    it('should display Caption font family when Caption provided', () => {
      render(<ButtonInsideText wording={wording} typography="Caption" />)
      const button = screen.getByText(wording)
      expect(button).toHaveStyle({ fontFamily: theme.typography.caption.fontFamily })
    })
  })
  describe('* html tag and type attribute', () => {
    it('should render button tag of type button by default', () => {
      render(<ButtonInsideText wording={wording} />)
      const button = screen.getByTestId(wording)
      expect(button.tagName.toLowerCase()).toBe('button')
    })
    it('should render anchor tag without type if component is an anchor', () => {
      const href = 'https://example.link/'
      render(<ButtonInsideText wording={wording} href={href} />)
      const link = screen.getByTestId(wording)
      expect(link.tagName.toLowerCase()).toBe('a')
      expect(link.getAttribute('href')).toBe(href)
    })
  })
  describe('* color property', () => {
    it('should display primary color when not provided', () => {
      render(<ButtonInsideText wording={wording} />)
      const button = screen.getByText(wording)
      expect(button).toHaveStyle({ color: theme.colors.primary })
    })
    it('should display custom color when color provided', () => {
      render(<ButtonInsideText wording={wording} buttonColor={theme.colors.greenValid} />)
      const button = screen.getByText(wording)
      expect(button).toHaveStyle({ color: theme.colors.greenValid })
    })
  })
})
