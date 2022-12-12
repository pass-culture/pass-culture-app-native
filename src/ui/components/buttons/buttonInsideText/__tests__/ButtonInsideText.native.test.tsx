import React from 'react'

import { render } from 'tests/utils'
import { theme } from 'theme'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

import { ButtonInsideText } from '../ButtonInsideText'

const wording = 'Wording'

describe('ButtonInsideText Component', () => {
  describe('* Icon property', () => {
    it('should not display icon when not provided', () => {
      const { queryByTestId } = render(<ButtonInsideText wording={wording} />)
      expect(queryByTestId('button-icon')).toBeNull()
    })
    it('should display icon when provided', () => {
      const { queryByTestId } = render(
        <ButtonInsideText wording={wording} icon={ExternalSiteFilled} />
      )
      expect(queryByTestId('button-icon')).toBeTruthy()
    })
  })
  describe('* typography property', () => {
    it('should display ButtonText font family when not provided', () => {
      const { getByText } = render(<ButtonInsideText wording={wording} />)
      const buttonFontFamily = getByText(wording).props.style[0].fontFamily
      expect(buttonFontFamily).toBe(theme.typography.buttonText.fontFamily)
    })
    it('should display Caption font family when Caption provided', () => {
      const { getByText } = render(<ButtonInsideText wording={wording} typography="Caption" />)
      const buttonFontFamily = getByText(wording).props.style[0].fontFamily
      expect(buttonFontFamily).toBe(theme.typography.caption.fontFamily)
    })
  })
  describe('* color property', () => {
    it('should display primary color when not provided', () => {
      const { getByText } = render(<ButtonInsideText wording={wording} />)
      const buttonColor = getByText(wording).props.style[0].color
      expect(buttonColor).toBe(theme.colors.primary)
    })
    it('should display custom color when color provided', () => {
      const { getByText } = render(
        <ButtonInsideText wording={wording} buttonColor={theme.colors.greenValid} />
      )
      const buttonColor = getByText(wording).props.style[0].color
      expect(buttonColor).toBe(theme.colors.greenValid)
    })
  })
})
