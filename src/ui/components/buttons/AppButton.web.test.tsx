import React from 'react'

import { render } from 'tests/utils/web'
import { fireEvent } from 'tests/utils/web'
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
      expect(queryByTestId('button-icon')).toBeFalsy()
    })
  })
  describe('* isLoading property', () => {
    it('should display right elements when isLoading equals true', () => {
      const { queryByTestId } = render(<AppButton {...baseProps} isLoading />)
      expect(queryByTestId('button-isloading-icon')).toBeTruthy()
      expect(queryByTestId('button-icon')).toBeFalsy()
    })
    it('should display right elements when isLoading equals false', () => {
      const { queryByTestId } = render(<AppButton {...baseProps} isLoading={false} />)
      expect(queryByTestId('button-icon')).toBeTruthy()
      expect(queryByTestId('button-isloading-icon')).toBeFalsy()
    })
  })
  describe('* Disabled property', () => {
    it('should disable handlers when disabled equals true', () => {
      const onPress = jest.fn()
      const onLongPress = jest.fn()
      const { getByText, rerender } = render(
        <AppButton {...baseProps} disabled onPress={onPress} onLongPress={onLongPress} />
      )

      const button = getByText('Testing Disabled')
      fireEvent.click(button)
      fireEvent.doubleClick(button)

      expect(onPress).not.toHaveBeenCalled()
      expect(onLongPress).not.toHaveBeenCalled()

      rerender(<AppButton {...baseProps} onPress={onPress} onLongPress={onLongPress} />)

      fireEvent.click(button)
      fireEvent.doubleClick(button)

      expect(onPress).toHaveBeenCalled()
      expect(onLongPress).toHaveBeenCalled()
    })
  })
  describe('* inline property', () => {
    it('should use inline css style when true', () => {
      const renderAPI = render(<AppButton {...baseProps} wording="Testing inline" inline />)
      expect(renderAPI).toMatchSnapshot()
    })
  })
})
