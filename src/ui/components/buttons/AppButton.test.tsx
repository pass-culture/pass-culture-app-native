import { render } from '@testing-library/react-native'
import React from 'react'

import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum } from 'ui/theme'

import { AppButton } from './AppButton'

describe('AppButton Component', () => {
  describe('* Icon property', () => {
    it('should display icon when provided', () => {
      const { getByTestId } = render(
        <AppButton title="Testing Disabled" loadingIconColor={ColorsEnum.BLACK} icon={Close} />
      )
      getByTestId('button-icon')
    })
    it('should not display icon when not provided', () => {
      const { getByTestId } = render(
        <AppButton title="Testing Disabled" loadingIconColor={ColorsEnum.BLACK} />
      )
      try {
        getByTestId('button-icon')
        fail()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
  describe('* isLoading property', () => {
    it('should display right elements when isLoading equals true', () => {
      const { getByTestId } = render(
        <AppButton
          title="Testing Disabled"
          loadingIconColor={ColorsEnum.BLACK}
          isLoading
          icon={Close}
        />
      )
      getByTestId('button-isloading-icon')
      try {
        getByTestId('button-icon')
        fail()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
    it('should display right elements when isLoading equals false', () => {
      const { getByTestId } = render(
        <AppButton
          title="Testing Disabled"
          loadingIconColor={ColorsEnum.BLACK}
          isLoading={false}
          icon={Close}
        />
      )

      getByTestId('button-icon')
      try {
        getByTestId('button-isloading-icon')
        fail()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
  describe('* Disabled property', () => {
    it('should disable handlers when disabled equals true', () => {
      const { getByTestId } = render(
        <AppButton
          title="Testing Disabled"
          loadingIconColor={ColorsEnum.BLACK}
          icon={Close}
          disabled
        />
      )

      const container = getByTestId('button-container')

      expect(container.props.onPress).toBeFalsy()
      expect(container.props.onLongPress).toBeFalsy()
    })
  })
})
