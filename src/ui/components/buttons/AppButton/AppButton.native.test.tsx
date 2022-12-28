import React from 'react'

import { render } from 'tests/utils'
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
      const { queryByTestId } = render(<AppButton {...baseProps} />)
      expect(queryByTestId('button-icon')).toBeTruthy()
    })
    it('should not display icon when not provided', () => {
      const { queryByTestId } = render(<AppButton {...baseProps} icon={undefined} />)
      expect(queryByTestId('button-icon')).toBeNull()
    })
  })
  describe('* isLoading property', () => {
    it('should display right elements when isLoading equals true', () => {
      const { queryByTestId } = render(<AppButton {...baseProps} isLoading />)
      expect(queryByTestId('Chargement en cours')).toBeTruthy()
      expect(queryByTestId('button-icon')).toBeNull()
    })
    it('should display right elements when isLoading equals false', () => {
      const { queryByTestId } = render(<AppButton {...baseProps} isLoading={false} />)
      expect(queryByTestId('button-icon')).toBeTruthy()
      expect(queryByTestId('Chargement en cours')).toBeNull()
    })
  })
  describe('* Disabled property', () => {
    it('should disable handlers when disabled equals true', () => {
      const { getByTestId } = render(<AppButton {...baseProps} disabled />)

      const container = getByTestId('Testing Disabled')

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
