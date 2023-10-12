import React from 'react'

import { render, screen } from 'tests/utils'
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
      expect(screen.queryByTestId('button-icon')).toBeOnTheScreen()
    })
    it('should not display icon when not provided', () => {
      render(<AppButton {...baseProps} icon={undefined} />)
      expect(screen.queryByTestId('button-icon')).not.toBeOnTheScreen()
    })
  })
  describe('* isLoading property', () => {
    it('should display right elements when isLoading equals true', () => {
      render(<AppButton {...baseProps} isLoading />)
      expect(screen.queryByTestId('Chargement en cours')).toBeOnTheScreen()
      expect(screen.queryByTestId('button-icon')).not.toBeOnTheScreen()
    })
    it('should display right elements when isLoading equals false', () => {
      render(<AppButton {...baseProps} isLoading={false} />)
      expect(screen.queryByTestId('button-icon')).toBeOnTheScreen()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })
  describe('* Disabled property', () => {
    it('should disable handlers when disabled equals true', () => {
      render(<AppButton {...baseProps} disabled />)

      const container = screen.getByTestId('Testing Disabled')

      expect(container.props.onPress).toBeFalsy()
      expect(container.props.onLongPress).toBeFalsy()
    })
  })
  describe('* inline property', () => {
    it('should use inline css style when true', () => {
      const renderAPI = render(<AppButton {...baseProps} wording="Testing inline" inline />)
      expect(renderAPI).toMatchSnapshot()
    })
  })
})
