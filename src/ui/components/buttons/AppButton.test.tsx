import { render } from '@testing-library/react-native'
import React from 'react'

import { Close } from 'ui/svg/icons/Close'

import { AppButton } from './AppButton'
import { AppButtonTheme, AppButtonThemesConfiguration } from './types'

describe('AppButton Component', () => {
  describe('* Icon property', () => {
    it('should display icon when provided', () => {
      const { getByTestId } = render(
        <AppButton title="Testing Disabled" buttonTheme={AppButtonTheme.PRIMARY} icon={Close} />
      )
      getByTestId('button-icon')
    })
    it('should not display icon when not provided', () => {
      const { getByTestId } = render(
        <AppButton title="Testing Disabled" buttonTheme={AppButtonTheme.PRIMARY} />
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
          buttonTheme={AppButtonTheme.PRIMARY}
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
          buttonTheme={AppButtonTheme.PRIMARY}
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
    describe('isLoading property : Container style', () => {
      it.each([
        AppButtonTheme.PRIMARY,
        AppButtonTheme.SECONDARY,
        AppButtonTheme.TERTIARY,
        AppButtonTheme.QUATERNARY,
      ])(
        'should pass the right style when isLoading equals true and theme is: %s',
        (buttonTheme) => {
          const { getByTestId } = render(
            <AppButton title="Testing Disabled" buttonTheme={buttonTheme} isLoading icon={Close} />
          )
          const container = getByTestId('button-container')

          const containerBackgroundColor = container.props.style.backgroundColor
          const defaultBackgroundColor =
            AppButtonThemesConfiguration[buttonTheme].container?.backgroundColor
          const expectedBackgroundColor =
            AppButtonThemesConfiguration[buttonTheme].isLoadingContainer?.backgroundColor
          if (expectedBackgroundColor) {
            expect(containerBackgroundColor).toEqual(expectedBackgroundColor)
          } else {
            expect(containerBackgroundColor).toEqual(defaultBackgroundColor)
          }

          const containerBorderColor = container.props.style.borderColor
          const defaultBorderColor =
            AppButtonThemesConfiguration[buttonTheme].container?.borderColor
          const expectedBorderColor =
            AppButtonThemesConfiguration[buttonTheme].isLoadingContainer?.borderColor
          if (expectedBorderColor) {
            expect(containerBorderColor).toEqual(expectedBorderColor)
          } else {
            expect(containerBorderColor).toEqual(defaultBorderColor)
          }
        }
      )
    })
  })
  describe('* Disabled property', () => {
    it('should disable handlers when disabled equals true', () => {
      const { getByTestId } = render(
        <AppButton
          title="Testing Disabled"
          buttonTheme={AppButtonTheme.PRIMARY}
          icon={Close}
          disabled
        />
      )

      const container = getByTestId('button-container')

      expect(container.props.onPress).toBeFalsy()
      expect(container.props.onLongPress).toBeFalsy()
    })
    describe('Disabled property : Container style', () => {
      it.each([
        AppButtonTheme.PRIMARY,
        AppButtonTheme.SECONDARY,
        AppButtonTheme.TERTIARY,
        AppButtonTheme.QUATERNARY,
      ])(
        'should pass the right style to the container when disabled equals true and theme is: %s',
        (buttonTheme) => {
          const { getByTestId } = render(
            <AppButton title="Testing Disabled" buttonTheme={buttonTheme} icon={Close} disabled />
          )

          const container = getByTestId('button-container')

          const containerBackgroundColor = container.props.style.backgroundColor
          const defaultBackgroundColor =
            AppButtonThemesConfiguration[buttonTheme].container?.backgroundColor
          const expectedBackgroundColor =
            AppButtonThemesConfiguration[buttonTheme].disabledContainer?.backgroundColor
          if (expectedBackgroundColor) {
            expect(containerBackgroundColor).toEqual(expectedBackgroundColor)
          } else {
            expect(containerBackgroundColor).toEqual(defaultBackgroundColor)
          }

          const containerBorderColor = container.props.style.borderColor
          const defaultBorderColor =
            AppButtonThemesConfiguration[buttonTheme].container?.borderColor
          const expectedBorderColor =
            AppButtonThemesConfiguration[buttonTheme].disabledContainer?.borderColor
          if (expectedBorderColor) {
            expect(containerBorderColor).toEqual(expectedBorderColor)
          } else {
            expect(containerBorderColor).toEqual(defaultBorderColor)
          }
        }
      )
    })
    describe('Disabled property : Icon style', () => {
      it.each([
        AppButtonTheme.PRIMARY,
        AppButtonTheme.SECONDARY,
        AppButtonTheme.TERTIARY,
        AppButtonTheme.QUATERNARY,
      ])(
        'should pass the right style to the icon when disabled equals true and theme is: %s',
        (buttonTheme) => {
          const { getByTestId } = render(
            <AppButton title="Testing Disabled" buttonTheme={buttonTheme} icon={Close} disabled />
          )

          const icon = getByTestId('button-icon')
          const closeIconColor = icon.props.children.props.children.props.children.props.fill

          const defaultColor = AppButtonThemesConfiguration[buttonTheme].icon?.color
          const expectedDisabledColor =
            AppButtonThemesConfiguration[buttonTheme].disabledIcon?.color
          if (expectedDisabledColor) {
            expect(closeIconColor === expectedDisabledColor).toBeTruthy()
          } else {
            expect(closeIconColor === defaultColor).toBeTruthy()
          }
        }
      )
    })
    describe('Disabled property : Title style', () => {
      it.each([
        AppButtonTheme.PRIMARY,
        AppButtonTheme.SECONDARY,
        AppButtonTheme.TERTIARY,
        AppButtonTheme.QUATERNARY,
      ])(
        'should pass the right style to the title when disabled equals true and theme is: %s',
        (buttonTheme) => {
          const { getByTestId } = render(
            <AppButton title="Testing Disabled" buttonTheme={buttonTheme} icon={Close} disabled />
          )

          const title = getByTestId('button-title')
          const titleColor = title.props.style[0].color

          const defaultColor = AppButtonThemesConfiguration[buttonTheme].title?.color
          const expectedDisabledColor =
            AppButtonThemesConfiguration[buttonTheme].disabledTitle?.color
          if (expectedDisabledColor) {
            expect(titleColor).toEqual(expectedDisabledColor)
          } else {
            expect(titleColor).toEqual(defaultColor)
          }
        }
      )
    })
  })
})
