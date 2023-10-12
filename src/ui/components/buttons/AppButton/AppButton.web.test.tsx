import React from 'react'

import { render, fireEvent, screen } from 'tests/utils/web'
import { Close } from 'ui/svg/icons/Close'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

import { AppButton } from './AppButton'

const baseProps = {
  title: Typo.ButtonText,
  loadingIndicator: InitialLoadingIndicator,
  wording: 'Testing Disabled',
  icon: Close,
}

describe('AppButton Component', () => {
  describe('* Icon property', () => {
    it('should display icon when provided', () => {
      render(<AppButton {...baseProps} />)
      expect(screen.getByTestId('button-icon')).toBeInTheDocument()
    })
    it('should not display icon when not provided', () => {
      render(<AppButton {...baseProps} icon={undefined} />)
      expect(screen.queryByTestId('button-icon')).not.toBeInTheDocument()
    })
  })
  describe('* isLoading property', () => {
    it('should display right elements when isLoading equals true', () => {
      render(<AppButton {...baseProps} isLoading />)
      expect(screen.getByTestId('Chargement en cours')).toBeInTheDocument()
      expect(screen.queryByTestId('button-icon')).not.toBeInTheDocument()
    })
    it('should display right elements when isLoading equals false', () => {
      render(<AppButton {...baseProps} isLoading={false} />)
      expect(screen.getByTestId('button-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeInTheDocument()
    })
  })
  describe('* Disabled property', () => {
    it('should disable handlers when disabled equals true', () => {
      const onPress = jest.fn()
      const onLongPress = jest.fn()
      const { rerender } = render(
        <AppButton {...baseProps} disabled onPress={onPress} onLongPress={onLongPress} />
      )

      const button = screen.getByText('Testing Disabled')
      fireEvent.click(button)
      fireEvent.doubleClick(button)

      expect(onPress).not.toHaveBeenCalled()
      expect(onLongPress).not.toHaveBeenCalled()

      rerender(<AppButton {...baseProps} onPress={onPress} onLongPress={onLongPress} />)

      fireEvent.click(button)
      fireEvent.doubleClick(button)

      expect(onPress).toHaveBeenCalledTimes(1)
      expect(onLongPress).toHaveBeenCalledTimes(1)
    })
  })
  describe('* inline property', () => {
    it('should use inline css style when true', () => {
      const renderAPI = render(<AppButton {...baseProps} wording="Testing inline" inline />)
      expect(renderAPI).toMatchSnapshot()
    })
  })
  describe('* html tag and type attribute', () => {
    it('should render button tag of type button by default', () => {
      render(<AppButton {...baseProps} testID="button" />)
      const button = screen.getByTestId('Testing Disabled')
      expect(button.tagName.toLowerCase()).toBe('button')
      expect(button.getAttribute('type')).toBe('button')
    })
    it('should render anchor tag without type if component is an anchor', () => {
      const href = 'https://example.link/'
      render(<AppButton {...baseProps} testID="link" href={href} />)
      const link = screen.getByTestId('Testing Disabled')
      expect(link.tagName.toLowerCase()).toBe('a')
      expect(link.getAttribute('href')).toBe(href)
      expect(link.getAttribute('type')).toBeNull()
    })
  })
})
