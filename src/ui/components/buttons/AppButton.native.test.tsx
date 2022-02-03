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
      const { getByTestId } = render(<AppButton {...baseProps} />)
      getByTestId('button-icon')
    })
    it('should not display icon when not provided', () => {
      const { queryByTestId } = render(<AppButton {...baseProps} icon={undefined} />)
      const icon = queryByTestId('button-icon')
      expect(icon).toBeFalsy()
    })
  })
  describe('* isLoading property', () => {
    it('should display right elements when isLoading equals true', () => {
      const { getByTestId, queryByTestId } = render(<AppButton {...baseProps} isLoading />)
      getByTestId('button-isloading-icon')
      const icon = queryByTestId('button-icon')
      expect(icon).toBeFalsy()
    })
    it('should display right elements when isLoading equals false', () => {
      const { getByTestId, queryByTestId } = render(<AppButton {...baseProps} isLoading={false} />)

      getByTestId('button-icon')
      const icon = queryByTestId('button-isloading-icon')
      expect(icon).toBeFalsy()
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
