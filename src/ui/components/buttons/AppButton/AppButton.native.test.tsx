import React from 'react'

import { render, screen } from 'tests/utils'
import { Close } from 'ui/svg/icons/Close'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

import { AppButton } from './AppButton'

const baseProps = {
  title: Typo.Button,
  loadingIndicator: InitialLoadingIndicator,
  wording: 'Testing Disabled',
  icon: Close,
}

describe('AppButton Component', () => {
  describe('* Icon property', () => {
    it('should display icon when provided', () => {
      render(<AppButton {...baseProps} />)

      expect(screen.getByTestId('button-icon-left')).toBeOnTheScreen()
      expect(screen.queryByTestId('button-icon-right')).not.toBeOnTheScreen()
    })

    it('should display icon when provided and icon position is left', () => {
      render(<AppButton iconPosition="left" {...baseProps} />)

      expect(screen.getByTestId('button-icon-left')).toBeOnTheScreen()
      expect(screen.queryByTestId('button-icon-right')).not.toBeOnTheScreen()
    })

    it('should display icon when provided and icon position is right', () => {
      render(<AppButton iconPosition="right" {...baseProps} />)

      expect(screen.getByTestId('button-icon-right')).toBeOnTheScreen()
      expect(screen.queryByTestId('button-icon-left')).not.toBeOnTheScreen()
    })

    it('should not display icon when not provided', () => {
      render(<AppButton {...baseProps} icon={undefined} />)

      expect(screen.queryByTestId('button-icon-left')).not.toBeOnTheScreen()
    })
  })

  describe('* isLoading property', () => {
    it('should display right elements when isLoading equals true', () => {
      render(<AppButton {...baseProps} isLoading />)

      expect(screen.getByTestId('Chargement en cours')).toBeOnTheScreen()
      expect(screen.queryByTestId('button-icon-left')).not.toBeOnTheScreen()
    })

    it('should display right elements when isLoading equals false', () => {
      render(<AppButton {...baseProps} isLoading={false} />)

      expect(screen.getByTestId('button-icon-left')).toBeOnTheScreen()
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
})
