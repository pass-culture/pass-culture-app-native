import React from 'react'

import { render } from 'tests/utils/web'
import { theme } from 'theme'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

import { ButtonInsideText } from '../ButtonInsideText'

const wording = 'Wording'

describe('ButtonInsideText Component', () => {
  describe('* Icon property', () => {
    it('should not display icon when not provided', () => {
      const { queryByTestId } = render(<ButtonInsideText wording={wording} />)
      expect(queryByTestId('button-icon')).toBeFalsy()
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
      const button = getByText(wording)
      expect(button).toHaveStyle({ fontFamily: theme.typography.buttonText.fontFamily })
    })
    it('should display Caption font family when Caption provided', () => {
      const { getByText } = render(<ButtonInsideText wording={wording} typography="Caption" />)
      const button = getByText(wording)
      expect(button).toHaveStyle({ fontFamily: theme.typography.caption.fontFamily })
    })
  })
  describe('* html tag and type attribute', () => {
    it('should render button tag of type button by default', () => {
      const { getByTestId } = render(<ButtonInsideText wording={wording} />)
      const button = getByTestId('button-inside-text')
      expect(button.tagName.toLowerCase()).toBe('button')
    })
    it('should render anchor tag without type if component is an anchor', () => {
      const href = 'https://example.link/'
      const { getByTestId } = render(<ButtonInsideText wording={wording} externalHref={href} />)
      const link = getByTestId('button-inside-text')
      expect(link.tagName.toLowerCase()).toBe('a')
      expect(link.getAttribute('href')).toBe(href)
    })
  })
})
